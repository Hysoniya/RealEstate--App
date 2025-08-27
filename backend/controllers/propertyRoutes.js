const express = require("express");
const router = express.Router();

const Property = require("../models/property");
const { uploadOnCloudinary } = require("../util/cloudinary.js");
const { upload } = require("../middleware/multer.middleware.js");

// Create Property
router.post(
  "/property",
  upload.fields([{ name: "propertyImage", maxCount: 8 }]),
  async (req, res) => {
    try {
      console.log("Received body:", req.body);
      
      // Initialize image_urls as empty array
      let image_urls = [];

      // Handle file uploads
      if (req.files?.propertyImage) {
        for (const file of req.files.propertyImage) {
          try {
            const uploadResult = await uploadOnCloudinary(file.path);
            if (uploadResult?.url) {
              image_urls.push(uploadResult.url);
            }
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);
            // Continue with other images even if one fails
          }
        }
      }

      // Parse other_rooms safely
      let other_rooms = {
        studyRoom: false,
        poojaRoom: false,
        servantRoom: false,
        storeRoom: false
      };
      
      try {
        if (req.body.other_rooms) {
          const parsedRooms = JSON.parse(req.body.other_rooms);
          other_rooms = {
            studyRoom: !!parsedRooms.studyRoom,
            poojaRoom: !!parsedRooms.poojaRoom,
            servantRoom: !!parsedRooms.servantRoom, // Fixed typo from servantRoom
            storeRoom: !!parsedRooms.storeRoom
          };
        }
      } catch (parseError) {
        console.error("Error parsing other_rooms:", parseError);
      }

      // Parse amenities safely
      let amenities = [];
      if (req.body.amenities) {
        try {
          amenities = Array.isArray(req.body.amenities) 
            ? req.body.amenities 
            : JSON.parse(req.body.amenities);
        } catch {
          amenities = typeof req.body.amenities === 'string' 
            ? req.body.amenities.split(',').map(a => a.trim()) 
            : [];
        }
      }

      // Create new property
      const newProperty = new Property({
        title: req.body.title || "",
        description: req.body.description || "",
        address: req.body.address || "",
        city: req.body.city || "",
        price: parseFloat(req.body.price) || 0,
        area: req.body.areaDetails || req.body.area || "",
        type: req.body.propertyType || "Residential",
        purpose: req.body.purpose || "sell",
        status: req.body.status || "Available",
        amenities,
        landmark: req.body.landmark || "",
        Bhk: req.body.numberOfBedrooms || req.body.bhk || "",
        bathrooms: req.body.numberOfBathrooms || req.body.bathrooms || "",
        balconies: req.body.numberOfBalconies || req.body.balconies || "",
        floors: req.body.totalFloorDetails || req.body.floors || "",

        postedBy: req.body.posterType || req.body.postedBy || "Owner",
        availabilityStatus: req.body.availability || "Immediate",
        Propreiter_name: req.body.proprietorName || "",
        Propreiter_email: req.body.proprietorEmail || "",
        Propreiter_contact: req.body.proprietorPhone || req.body.proprietorContact || "",
        phone: req.body.phone || "",
        mail: req.body.mail || "",
        allInclusivePrice: req.body.allInclusivePrice === "true",
        taxAndGovtChargesExcluded: req.body.taxAndGovtChargesExcluded === "true",
        priceNegotiable: req.body.priceNegotiable === "true",
        other_rooms,
        images: image_urls,
      });

      await newProperty.save();
      res.status(201).json({
        success: true,
        property: newProperty
      });
      
    } catch (error) {
      console.error("Property creation failed:", error);
      res.status(500).json({ 
        success: false,
        error: error.message || "Internal Server Error" 
      });
    }
  }
);

// Get All Properties
router.get("/allproperty", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// property query and city

router.get("/property", async (req, res) => {
  const { city, query } = req.query;

  try {
    const filters = [];

    if (city && typeof city === "string") {
      filters.push({
        city: { $regex: city.trim(), $options: "i" },
      });
    }

    if (query && typeof query === "string") {
      const bhkQuery = parseInt(query, 10);

      filters.push({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { city: { $regex: query, $options: "i" } },
          { type: { $regex: query, $options: "i" } },
          ...(isNaN(bhkQuery) ? [] : [{ Bhk: bhkQuery }]),
        ],
      });
    }

    const searchQuery = filters.length > 0 ? { $and: filters } : {};

    const properties = await Property.find(searchQuery);
    res.json(properties);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/propertyPurpose", async (req, res) => {
  const { query } = req.query;
  try {
    const searchQuery = {
      $or: [
        {
          purpose: {
            $regex: typeof query === "string" ? query : "",
            $options: "i",
          },
        },
        {
          type: {
            $regex: typeof query === "string" ? query : "",
            $options: "i",
          },
        },
      ],
    };

    const properties = await Property.find(searchQuery);
    res.json(properties);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Email Verification
router.get("/property-user/:email_id", async (req, res) => {
  try {
    const { email_id } = req.params;

    const properties = await Property.find({ Propreiter_email: email_id });

    const totalHosted = properties.length;
    const totalSoldOrRented = properties.filter(
      (p) => p.status === "Sold" || p.status === "Rented"
    ).length;
    const availableProperties = properties.filter(
      (p) => p.status === "Available"
    ).length;

    res.json({
      success: true,
      data: properties,
      stats: {
        totalHosted,
        totalSoldOrRented,
        availableProperties,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Admin purpose
router.get("/property/verification", async (req, res) => {
  try {
    const property_verify = await Property.find({ verification: "pending" });
    return res.json({ success: true, property_verify });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/property/:property_id", async (req, res) => {
  const { property_id } = req.params;

  try {
    let property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    return res.json({ success: true, property: property });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Property
router.delete("/property/:property_id", async (req, res) => {
  const { property_id } = req.params;
  try {
    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    await Property.findByIdAndDelete(property_id);
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Property
router.put("/property/:property_id", async (req, res) => {
  const { property_id } = req.params;
  try {
    let property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    property = await Property.findByIdAndUpdate(property_id, req.body, {
      new: true,
    });
    res.json(property);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/property/:id/accept", async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    property.verification = "verified";
    await property.save();

    res.json({ success: true, message: "Property accepted and verified" });
  } catch (error) {
    console.error("Error accepting property:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to reject a property (delete from database)
router.put("/property/:id/reject", async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    await Property.findByIdAndDelete(propertyId);

    res.json({ success: true, message: "Property rejected and deleted" });
  } catch (error) {
    console.error("Error rejecting property:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/property/:id/sold", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const property = await Property.findByIdAndUpdate(id, { status: "Sold" });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({ success: true, data: property });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
