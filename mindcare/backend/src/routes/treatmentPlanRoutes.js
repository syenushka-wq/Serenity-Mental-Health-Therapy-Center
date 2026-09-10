const express = require('express');
const router = express.Router();
const treatmentPlanController = require('../controllers/treatmentPlanController');
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.use(authenticateToken);

router.get('/', treatmentPlanController.getAllTreatmentPlans);
router.post('/', authorize(['Admin', 'Therapist']), treatmentPlanController.createTreatmentPlan);
router.put('/:id', authorize(['Admin', 'Therapist']), treatmentPlanController.updateTreatmentPlan);

module.exports = router;
