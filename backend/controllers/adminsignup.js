const express = require("express");
const bcrypt = require("bcrypt");
const adminSignupRouter = new express.Router();
const Admin = require("../models/Admin");
const { authenticate, authorizeAdmin } = require("../middleware/auth");

adminSignupRouter.post(
  "/signup",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const { name,adminId, password } = req.body;

    if (!adminId || !password) {
      return res
        .status(400)
        .send({ error: "Admin ID and password are required." });
    }

    try {
      // Check if adminId already exists
      const existingAdmin = await Admin.findOne({ adminId });
      if (existingAdmin) {
        return res.status(400).send({ error: "Admin ID already exists." });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      console.log("req received",name)
      const newAdmin = new Admin({
        adminId,
        password: passwordHash,
        email: `${adminId}@mail.com`,
        fullName: name,
        phoneNumber: "",
        buyersId: [],
        sellersId: [],
      });

      await newAdmin.save();
      res.status(201).send({ message: "Admin created successfully." });
    } catch (e) {
      console.error("Error creating admin:", e);
      res.status(400).send({ error: "Failed to create admin." });
    }
  }
);

adminSignupRouter.get("/",authenticate, async (req, res) => {
  try {
    const admins = await Admin.find()
      .populate("buyersId", "name email")
      .populate("sellersId", "name email");

    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

adminSignupRouter.delete(
  "/:id",
  authenticate,
  async (request, response) => {
    const { id } = request.params;
    console.log("req")
    try {
      const deletedUser = await Admin.findByIdAndDelete(id);
      if (deletedUser) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      response.status(400).json({ error: "Invalid user ID" });
    }
  }
);

module.exports = adminSignupRouter;
