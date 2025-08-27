// routes/builderRoutes.js
const express = require('express');
const {
  createBuilder,
  getBuilders,
  getBuilderById,
  updateBuilder,
  deleteBuilder
} = require('../controllers/builder.js');

const router = express.Router();

router.post('/', createBuilder);
router.get('/', getBuilders);
router.get('/:id', getBuilderById);
router.put('/:id', updateBuilder);
router.delete('/:id', deleteBuilder);

module.exports = router; 
