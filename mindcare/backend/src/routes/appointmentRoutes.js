const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.use(authenticateToken);

// All authenticated roles can list appointments (filtered to their role scope)
router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);

// Admin, Receptionist, and Patient can create appointments
router.post('/', authorize(['Admin', 'Receptionist', 'Patient']), appointmentController.createAppointment);

// Admin, Receptionist, Therapist, and Patient can update/reschedule
router.put('/:id', authorize(['Admin', 'Receptionist', 'Therapist', 'Patient']), appointmentController.updateAppointment);

// Cancel appointment
router.delete('/:id', authorize(['Admin', 'Receptionist', 'Therapist', 'Patient']), appointmentController.cancelAppointment);

module.exports = router;
