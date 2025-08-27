// models/Builder.js
const mongoose = require('mongoose');

const builderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  image: { type: String, trim: true },
  description: { type: String, trim: true, maxlength: 2000 },
  builderUrl: { type: String, trim: true }
}, { timestamps: true });

const Builder = mongoose.models.Builder || mongoose.model('Builder', builderSchema);

module.exports = Builder;
