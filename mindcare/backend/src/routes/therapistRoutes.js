const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapistController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// Public or Authenticated can list therapists (to book appointments)
router.get('/', therapistController.getAllTherapists);
router.get('/:id', therapistController.getTherapistById);

router.use(authenticateToken);

// Admin can create, edit, deactivate therapists. Therapists can update their own profile/availability.
router.post('/', authorize(['Admin']), therapistController.createTherapist);
router.put('/:id', authorize(['Admin', 'Therapist']), therapistController.updateTherapist);
router.delete('/:id', authorize(['Admin']), therapistController.deleteTherapist);

module.exports = router;
