const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.use(authenticateToken);

// Admin, Therapist, Receptionist can list/search patients
router.get('/', authorize(['Admin', 'Therapist', 'Receptionist']), patientController.getAllPatients);

// Patient can view their own profile, staff can view any
router.get('/:id', authorize(['Admin', 'Therapist', 'Receptionist', 'Patient']), patientController.getPatientById);

// Admin & Receptionist can add new patients
router.post('/', authorize(['Admin', 'Receptionist']), patientController.createPatient);

// Admin, Receptionist, or Therapist updating medical history
router.put('/:id', authorize(['Admin', 'Receptionist', 'Therapist']), patientController.updatePatient);

// Admin only can deactivate/delete patient
router.delete('/:id', authorize(['Admin']), patientController.deletePatient);

module.exports = router;
