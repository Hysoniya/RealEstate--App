// controllers/builderController.js
const Builder = require('../models/builder.js');

// Create a new builder
const createBuilder = async (req, res) => {
  try {
    const { name, image, description, builderUrl } = req.body;

    const builder = new Builder({ name, image, description, builderUrl });
    const savedBuilder = await builder.save();

    res.status(201).json(savedBuilder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all builders
const getBuilders = async (req, res) => {
  try {
    const builders = await Builder.find();
    res.status(200).json(builders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single builder by ID
const getBuilderById = async (req, res) => {
  try {
    const builder = await Builder.findById(req.params.id);
    if (!builder) return res.status(404).json({ message: 'Builder not found' });

    res.status(200).json(builder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a builder
const updateBuilder = async (req, res) => {
  try {
    const { name, image, description, builderUrl } = req.body;

    const updatedBuilder = await Builder.findByIdAndUpdate(
      req.params.id,
      { name, image, description, builderUrl },
      { new: true, runValidators: true }
    );

    if (!updatedBuilder) return res.status(404).json({ message: 'Builder not found' });

    res.status(200).json(updatedBuilder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a builder
const deleteBuilder = async (req, res) => {
  try {
    const deletedBuilder = await Builder.findByIdAndDelete(req.params.id);
    if (!deletedBuilder) return res.status(404).json({ message: 'Builder not found' });

    res.status(200).json({ message: 'Builder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBuilder,
  getBuilders,
  getBuilderById,
  updateBuilder,
  deleteBuilder,
};
