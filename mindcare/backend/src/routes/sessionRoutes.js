const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.use(authenticateToken);

// All roles can view sessions (appropriately sanitized for patients)
router.get('/', sessionController.getAllSessions);

// Only Therapists and Admins can record session notes
router.post('/', authorize(['Admin', 'Therapist']), sessionController.createSession);
router.put('/:id', authorize(['Admin', 'Therapist']), sessionController.updateSession);

module.exports = router;
