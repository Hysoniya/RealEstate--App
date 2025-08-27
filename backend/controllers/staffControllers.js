const express = require("express");
const bcrypt = require("bcrypt");
const staffRouter = express.Router();
const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");
const { authenticate, authorizeAdmin } = require("../middleware/auth");
const Property = require("../models/property");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const User = require("../models/User");

const SECRET = "bearer";

// staff signup
staffRouter.post("/signup", authenticate, authorizeAdmin, async (req, res) => {
  const { email, password, fullName, role } = req.body;

  if (!email || !password || !fullName || !role) {
    return res.status(400).send({
      error: "All fields (email, password, fullName, role) are required.",
    });
  }

  try {
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res
        .status(400)
        .send({ error: "Staff with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const staffId = `basil${Date.now()}`;

    const newStaff = new Staff({
      staffId,
      email,
      password: passwordHash,
      fullName,
      role,
    });

    await newStaff.save();
    res.status(201).send({ message: "Staff created successfully." });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).send({ error: "Failed to create staff." });
  }
});

// get all staff details
staffRouter.get("/all", async (req, res) => {
  try {
    const staffList = await Staff.find().select("-password");
    res.status(200).send(staffList);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch staff." });
  }
});

// delete staff account
staffRouter.delete("/:id",async (req, res) => {
  const staffId = req.params.id;
  console.log("REQ")
  try {
    const deletedStaff = await Staff.findByIdAndDelete(staffId);

    if (!deletedStaff) {
      return res.status(404).send({ error: "Staff not found." });
    }

    res.status(200).send({ message: "Staff deleted successfully." });
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).send({ error: "Failed to delete staff." });
  }
});

// login staff
staffRouter.post("/login", async (req, res) => {
  const { staffId, password } = req.body;

  if (!staffId || !password) {
    return res
      .status(400)
      .json({ error: "Staff ID and password are required." });
  }

  try {
    const staff = await Staff.findOne({ staffId });

    if (!staff) {
      return res.status(404).json({ error: "Staff not found." });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const userForToken = {
      _id: staff._id,
      staffId: staff.staffId,
      fullName: staff.fullName,
      phoneNumber: staff.phoneNumber,
      email: staff.email,
      role: staff.role,
    };

    const token = jwt.sign(userForToken, SECRET || "bearer");

    res.status(200).json({
      message: "Login successful",
      token,
      staff,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
});

//update staff details
staffRouter.put("/update-detail/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { email, fullName } = req.body;

  if (!email || !fullName) {
    return res.status(400).json({ error: "Email and full name are required." });
  }

  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { email, fullName },
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ error: "Staff not found." });
    }

    const updatedTokenPayload = {
      _id: updatedStaff._id,
      staffId: updatedStaff.staffId,
      fullName: updatedStaff.fullName,
      phoneNumber: updatedStaff.phoneNumber,
      email: updatedStaff.email,
      role: updatedStaff.role,
    };

    const token = jwt.sign(updatedTokenPayload, SECRET || "bearer");

    res.status(200).json({
      message: "Staff details updated.",
      staff: updatedStaff,
      token,
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ error: "Failed to update staff." });
  }
});

//change staff password
staffRouter.put("/:id/change-password", authenticate, async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Both old and new passwords are required." });
  }

  try {
    const staff = await Staff.findById(id);

    if (!staff) {
      return res.status(404).json({ error: "Staff not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, staff.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    staff.password = hashedPassword;
    await staff.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ error: "Failed to update password." });
  }
});

// verify property by staff
staffRouter.put("/property/:id/accept/:staffId", async (req, res) => {
  try {
    const propertyId = req.params.id;
    const staffId = req.params.staffId;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    property.verification = "verified";
    await property.save();

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    staff.verifiedProperties.push({
      propertyId: property._id,
      verificationDate: new Date(),
      status: "Verified",
    });

    await staff.save();

    res.json({
      success: true,
      message: "Property accepted and verified",
      verifiedBy: staff.fullName,
    });
  } catch (error) {
    console.error("Error accepting property:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// confirmed appointment by staff
staffRouter.put("/appointment/confirmed/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { staffId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: "Invalid appointment ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return res.status(400).json({ error: "Invalid staff ID" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    appointment.status = "Confirmed";
    appointment.staffId = staffId;
    await appointment.save();

    staff.appointmentsHandled.push({
      appointmentId: appointment._id,
      date: new Date(),
      status: "Confirmed",
    });
    await staff.save();

    res.json({
      success: true,
      message: "Appointment confirmed successfully",
    });
  } catch (error) {
    console.error("Error confirming appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// cancel appointment by staff
staffRouter.put("/appointment/Cancelled/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { staffId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: "Invalid appointment ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return res.status(400).json({ error: "Invalid staff ID" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    appointment.status = "Cancelled";
    appointment.staffId = staffId;
    await appointment.save();

    staff.appointmentsHandled.push({
      appointmentId: appointment._id,
      date: new Date(),
      status: "Cancelled",
    });
    await staff.save();

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Error confirming appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// accept appointment by staff
staffRouter.put("/appointment/accept/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { staffId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: "Invalid appointment ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return res.status(400).json({ error: "Invalid staff ID" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    appointment.status = "Accepted";
    appointment.staffId = staffId;
    await appointment.save();

    staff.appointmentsHandled.push({
      appointmentId: appointment._id,
      date: new Date(),
      status: "Accepted",
    });
    await staff.save();

    res.json({
      success: true,
      message: "Appointment accepted successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error accepting appointment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get single appointment detail fo staff
staffRouter.get("/get-appointment/:appointmentId/details", async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("userId")
      .populate("staffId")
      .lean();

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({
      success: true,
      message: "Appointment details fetched successfully",
      appointmentDetails: appointment,
    });
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// update latest appointment log by staff
staffRouter.put("/appointment/:appointmentId/update-log", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, note, appointmentType, followUpDate, staffId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (status) {
      appointment.status = status;
    }

    const newLog = {
      status,
      note,
      staffId,
      appointmentType,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      updatedAt: new Date(),
    };

    appointment.appointmentUpdates.push(newLog);
    await appointment.save();

    if (staffId) {
      const staff = await Staff.findOne({ staffId });

      if (staff) {
        const existingIndex = staff.appointmentsHandled.findIndex(
          (item) => item.appointmentId.toString() === appointmentId
        );

        if (existingIndex !== -1) {
          staff.appointmentsHandled[existingIndex].status = status;
          staff.appointmentsHandled[existingIndex].date = new Date();
        } else {
          staff.appointmentsHandled.push({
            appointmentId,
            status,
            date: new Date(),
          });
        }

        await staff.save();
      }
    }

    res.json({
      success: true,
      message: "Appointment update log saved successfully",
      latestUpdate: newLog,
    });
  } catch (error) {
    console.error("Error updating appointment log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch all logs for a specific appointment
staffRouter.get("/appointment/:appointmentId/logs", async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(appointmentId)
      .select("appointmentUpdates")
      .populate("staffId");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({
      success: true,
      appointmentId,
      updates: appointment.appointmentUpdates,
    });
  } catch (error) {
    console.error("Error fetching appointment logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// fetch all user data for staff
staffRouter.get("/users-details", async (req, res) => {
  try {
    const data = await User.find();

    return res.json({
      success: true,
      message: "Users data fetch successfully",
      usersData: data,
    });
  } catch (error) {
    console.error("Error fetching users detail:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==================== SALES TARGET MANAGEMENT ROUTES ====================

// Get all employees (staff members) for sales target management
staffRouter.get("/employees", authenticate, async (req, res) => {
  try {
    const employees = await Staff.find().select("-password");
    
    res.json({
      success: true,
      message: "Employees fetched successfully",
      employees: employees
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Get all sales targets
staffRouter.get("/sales-targets", authenticate, async (req, res) => {
  try {
    // For now, we'll store sales targets in the Staff model
    // You might want to create a separate SalesTarget model later
    const staff = await Staff.find().select("salesTargets fullName staffId");
    
    // Extract all sales targets from all staff members
    let allSalesTargets = [];
    staff.forEach(member => {
      if (member.salesTargets && member.salesTargets.length > 0) {
        member.salesTargets.forEach(target => {
          allSalesTargets.push({
            ...target.toObject(),
            employeeName: member.fullName,
            employeeStaffId: member.staffId,
            _id: target._id
          });
        });
      }
    });

    res.json({
      success: true,
      message: "Sales targets fetched successfully",
      salesTargets: allSalesTargets
    });
  } catch (error) {
    console.error("Error fetching sales targets:", error);
    res.status(500).json({ error: "Failed to fetch sales targets" });
  }
});

// Create a new sales target
staffRouter.post("/sales-targets", authenticate, async (req, res) => {
  try {
    const { employeeId, targetAmount, targetPeriod, targetType, deadline, description } = req.body;

    if (!employeeId || !targetAmount || !targetPeriod || !targetType || !deadline) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const staff = await Staff.findById(employeeId);
    if (!staff) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Initialize salesTargets array if it doesn't exist
    if (!staff.salesTargets) {
      staff.salesTargets = [];
    }

    const newTarget = {
      targetAmount: parseFloat(targetAmount),
      targetPeriod,
      targetType,
      deadline: new Date(deadline),
      description: description || "",
      achievedAmount: 0,
      status: "active",
      createdAt: new Date()
    };

    staff.salesTargets.push(newTarget);
    await staff.save();

    // Get the created target with its ID
    const createdTarget = staff.salesTargets[staff.salesTargets.length - 1];

    res.json({
      success: true,
      message: "Sales target created successfully",
      salesTarget: {
        ...createdTarget.toObject(),
        employeeName: staff.fullName,
        employeeStaffId: staff.staffId
      }
    });
  } catch (error) {
    console.error("Error creating sales target:", error);
    res.status(500).json({ error: "Failed to create sales target" });
  }
});

// Update a sales target
staffRouter.put("/sales-targets/:targetId", authenticate, async (req, res) => {
  try {
    const { targetId } = req.params;
    const updateData = req.body;

    // Find the staff member who has this target
    const staff = await Staff.findOne({ "salesTargets._id": targetId });
    
    if (!staff) {
      return res.status(404).json({ error: "Sales target not found" });
    }

    // Find and update the specific target
    const targetIndex = staff.salesTargets.findIndex(target => target._id.toString() === targetId);
    
    if (targetIndex === -1) {
      return res.status(404).json({ error: "Sales target not found" });
    }

    // Update the target fields
    Object.keys(updateData).forEach(key => {
      if (key === 'deadline' && updateData[key]) {
        staff.salesTargets[targetIndex][key] = new Date(updateData[key]);
      } else if (key === 'targetAmount' || key === 'achievedAmount') {
        staff.salesTargets[targetIndex][key] = parseFloat(updateData[key]);
      } else if (updateData[key] !== undefined) {
        staff.salesTargets[targetIndex][key] = updateData[key];
      }
    });

    staff.salesTargets[targetIndex].updatedAt = new Date();
    await staff.save();

    res.json({
      success: true,
      message: "Sales target updated successfully",
      salesTarget: {
        ...staff.salesTargets[targetIndex].toObject(),
        employeeName: staff.fullName,
        employeeStaffId: staff.staffId
      }
    });
  } catch (error) {
    console.error("Error updating sales target:", error);
    res.status(500).json({ error: "Failed to update sales target" });
  }
});

// Delete a sales target
staffRouter.delete("/sales-targets/:targetId", authenticate, async (req, res) => {
  try {
    const { targetId } = req.params;

    // Find the staff member who has this target
    const staff = await Staff.findOne({ "salesTargets._id": targetId });
    
    if (!staff) {
      return res.status(404).json({ error: "Sales target not found" });
    }

    // Remove the target
    staff.salesTargets = staff.salesTargets.filter(target => target._id.toString() !== targetId);
    await staff.save();

    res.json({
      success: true,
      message: "Sales target deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting sales target:", error);
    res.status(500).json({ error: "Failed to delete sales target" });
  }
});

// Get sales targets for a specific employee
staffRouter.get("/sales-targets/employee/:employeeId", authenticate, async (req, res) => {
  try {
    const { employeeId } = req.params;

    const staff = await Staff.findById(employeeId).select("salesTargets fullName staffId");
    
    if (!staff) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const salesTargets = staff.salesTargets || [];
    const targetsWithEmployeeInfo = salesTargets.map(target => ({
      ...target.toObject(),
      employeeName: staff.fullName,
      employeeStaffId: staff.staffId
    }));

    res.json({
      success: true,
      message: "Employee sales targets fetched successfully",
      salesTargets: targetsWithEmployeeInfo
    });
  } catch (error) {
    console.error("Error fetching employee sales targets:", error);
    res.status(500).json({ error: "Failed to fetch employee sales targets" });
  }
});

// Update sales progress/achievement
staffRouter.put("/sales-targets/:targetId/progress", authenticate, async (req, res) => {
  try {
    const { targetId } = req.params;
    const { achievedAmount, notes } = req.body;

    if (achievedAmount === undefined) {
      return res.status(400).json({ error: "Achieved amount is required" });
    }

    // Find the staff member who has this target
    const staff = await Staff.findOne({ "salesTargets._id": targetId });
    
    if (!staff) {
      return res.status(404).json({ error: "Sales target not found" });
    }

    // Find and update the specific target
    const targetIndex = staff.salesTargets.findIndex(target => target._id.toString() === targetId);
    
    if (targetIndex === -1) {
      return res.status(404).json({ error: "Sales target not found" });
    }

    staff.salesTargets[targetIndex].achievedAmount = parseFloat(achievedAmount);
    if (notes) {
      staff.salesTargets[targetIndex].notes = notes;
    }

    // Update status based on achievement
    const target = staff.salesTargets[targetIndex];
    const achievementPercentage = (target.achievedAmount / target.targetAmount) * 100;
    
    if (achievementPercentage >= 100) {
      target.status = "completed";
    } else if (new Date() > target.deadline) {
      target.status = "overdue";
    } else {
      target.status = "active";
    }

    target.updatedAt = new Date();
    await staff.save();

    res.json({
      success: true,
      message: "Sales progress updated successfully",
      salesTarget: {
        ...staff.salesTargets[targetIndex].toObject(),
        employeeName: staff.fullName,
        employeeStaffId: staff.staffId
      }
    });
  } catch (error) {
    console.error("Error updating sales progress:", error);
    res.status(500).json({ error: "Failed to update sales progress" });
  }
});

module.exports = staffRouter;