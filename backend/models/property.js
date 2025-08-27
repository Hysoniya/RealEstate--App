const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  title: { type: String, required: true },
  description: { type: String, required: true },

  address: { type: String, required: true },
  city: { type: String, required: true },
  landmark: { type: String },

  price: { type: Number, required: true },
  Bhk: { type: Number },
  bathrooms: { type: Number },
  balconies: { type: Number },
  area: { type: Number },

  priceNegotiable: { type: Boolean, default: false },
  allInclusivePrice: { type: Boolean, default: false },
  taxAndGovtChargesExcluded: { type: Boolean, default: false },

  other_rooms: {
    studyRoom: { type: Boolean, default: false },
    poojaRoom: { type: Boolean, default: false },
    servantRoom: { type: Boolean, default: false },
    storeRoom: { type: Boolean, default: false },
  },

  type: { type: String, required: true },
  status: { type: String },
  floors: { type: String },
  availabilityStatus: {
    type: String,
    enum: ["Ready to Move", "Under Construction","Immediate"],
  },

  purpose: {
    type: String,
    enum: ["Rent", "Lease", "Sell", "Rent/Lease"],
    required: true,
  },

  phone: { type: String },
  mail: { type: String },

  Propreiter_name: {
    type: String,
    required: true,
  },

  Propreiter_email: {
    type: String,
    required: true,
  },

  Propreiter_contact: {
    type: String,
    required: true,
  },
  proprietorPhone: { type: String },

  posterType: { type: String },

  numberOfBedrooms: { type: Number },
  numberOfBathrooms: { type: Number },
  numberOfBalconies: { type: Number },
  areaDetails: { type: String },
  totalFloorDetails: { type: String },
  propertyFloorDetails: { type: String },

  ageOfProperty: { type: String },
  possessionDate: { type: String },
  ownershipType: { type: String },

  plotArea: { type: String },
  noOfFloorsConst: { type: String },
  boundary: { type: String },
  construction: { type: String },

  amenities: { type: [String], default: [] },
  images: [{ type: String }],

  postedBy: { type: String },

  verification: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },

  created_at: { type: Date, default: Date.now },
});

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
