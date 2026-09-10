const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.use(authenticateToken);

router.get('/', paymentController.getAllPayments);
router.get('/summary', authorize(['Admin', 'Receptionist']), paymentController.getRevenueSummary);
router.post('/', authorize(['Admin', 'Receptionist', 'Patient']), paymentController.createPayment);
router.put('/:id', authorize(['Admin', 'Receptionist']), paymentController.updatePayment);

module.exports = router;
