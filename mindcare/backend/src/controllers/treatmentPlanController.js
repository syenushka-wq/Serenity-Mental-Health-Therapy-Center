const { TreatmentPlan, Patient, Therapist } = require('../models');

// Get All Treatment Plans
exports.getAllTreatmentPlans = async (req, res, next) => {
  try {
    const { patientId, therapistId, status } = req.query;
    const where = {};

    if (req.user.role === 'Patient') {
      if (!req.user.patientProfile) return res.json({ success: true, treatmentPlans: [] });
      where.patientId = req.user.patientProfile.id;
    } else if (req.user.role === 'Therapist') {
      if (!req.user.therapistProfile) return res.json({ success: true, treatmentPlans: [] });
      where.therapistId = req.user.therapistProfile.id;
    }

    if (patientId) where.patientId = patientId;
    if (therapistId) where.therapistId = therapistId;
    if (status && status !== 'All') where.status = status;

    const plans = await TreatmentPlan.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'patientCode', 'fullName'] },
        { model: Therapist, as: 'therapist', attributes: ['id', 'therapistCode', 'fullName', 'specialization'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      treatmentPlans: plans,
    });
  } catch (error) {
    next(error);
  }
};

// Create Treatment Plan
exports.createTreatmentPlan = async (req, res, next) => {
  try {
    const {
      patientId,
      therapistId,
      title,
      diagnosis,
      startDate,
      endDate,
      goals,
      recommendedSessions,
    } = req.body;

    if (!patientId || !therapistId || !title || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Patient, Therapist, Title, and Start Date are required.',
      });
    }

    const planCount = await TreatmentPlan.count();
    const planCode = `TP-${String(4001 + planCount).padStart(4, '0')}`;

    const newPlan = await TreatmentPlan.create({
      planCode,
      patientId,
      therapistId,
      title,
      diagnosis: diagnosis || '',
      startDate,
      endDate: endDate || null,
      goals: goals || '1. Identify symptom triggers\n2. Develop coping mechanisms\n3. Cognitive reframing',
      recommendedSessions: recommendedSessions || 8,
      completedSessions: 0,
      progressPercentage: 0,
      status: 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Treatment plan created successfully.',
      treatmentPlan: newPlan,
    });
  } catch (error) {
    next(error);
  }
};

// Update Treatment Plan (Goals, Progress, Status)
exports.updateTreatmentPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await TreatmentPlan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Treatment plan not found.' });
    }

    const {
      title,
      diagnosis,
      endDate,
      goals,
      recommendedSessions,
      completedSessions,
      progressPercentage,
      status,
    } = req.body;

    await plan.update({
      title: title !== undefined ? title : plan.title,
      diagnosis: diagnosis !== undefined ? diagnosis : plan.diagnosis,
      endDate: endDate !== undefined ? endDate : plan.endDate,
      goals: goals !== undefined ? goals : plan.goals,
      recommendedSessions: recommendedSessions !== undefined ? recommendedSessions : plan.recommendedSessions,
      completedSessions: completedSessions !== undefined ? completedSessions : plan.completedSessions,
      progressPercentage: progressPercentage !== undefined ? progressPercentage : plan.progressPercentage,
      status: status !== undefined ? status : plan.status,
    });

    res.json({
      success: true,
      message: 'Treatment plan updated successfully.',
      treatmentPlan: plan,
    });
  } catch (error) {
    next(error);
  }
};
