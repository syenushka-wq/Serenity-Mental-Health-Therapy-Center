const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// Public can view available services
router.get('/', serviceController.getAllServices);

// Admin can create or update therapy services
router.post('/', authenticateToken, authorize(['Admin']), serviceController.createService);
router.put('/:id', authenticateToken, authorize(['Admin']), serviceController.updateService);

module.exports = router;
