const { TherapySession, Appointment, Patient, Therapist, TreatmentPlan } = require('../models');

// Get All Sessions (with role filtering)
exports.getAllSessions = async (req, res, next) => {
  try {
    const { patientId, therapistId } = req.query;
    const where = {};

    if (req.user.role === 'Patient') {
      if (!req.user.patientProfile) return res.json({ success: true, sessions: [] });
      where.patientId = req.user.patientProfile.id;
    } else if (req.user.role === 'Therapist') {
      if (!req.user.therapistProfile) return res.json({ success: true, sessions: [] });
      where.therapistId = req.user.therapistProfile.id;
    }

    if (patientId) where.patientId = patientId;
    if (therapistId) where.therapistId = therapistId;

    const sessions = await TherapySession.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'patientCode', 'fullName', 'phone'] },
        { model: Therapist, as: 'therapist', attributes: ['id', 'therapistCode', 'fullName', 'specialization'] },
        { model: Appointment, as: 'appointment', attributes: ['id', 'appointmentCode', 'date', 'timeSlot', 'reason'] },
      ],
      order: [['sessionDate', 'DESC']],
    });

    // Sanitize confidential clinical notes for patients
    if (req.user.role === 'Patient') {
      sessions.forEach((s) => {
        s.setDataValue('therapyNotes', undefined);
      });
    }

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

// Create / Record Therapy Session
exports.createSession = async (req, res, next) => {
  try {
    const {
      appointmentId,
      patientId,
      therapistId,
      sessionDate,
      sessionDuration,
      sessionType,
      therapyNotes,
      patientSummary,
      progressLevel,
      homeworkAssigned,
      followUpRequired,
      followUpDate,
    } = req.body;

    if (!appointmentId || !patientId || !therapistId || !sessionDate) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID, Patient ID, Therapist ID, and Session Date are required.',
      });
    }

    // Check if session already recorded for this appointment
    const existingSession = await TherapySession.findOne({ where: { appointmentId } });
    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'A therapy session has already been recorded for this appointment.',
      });
    }

    const sessionCount = await TherapySession.count();
    const sessionCode = `SES-${String(3001 + sessionCount).padStart(4, '0')}`;

    const newSession = await TherapySession.create({
      sessionCode,
      appointmentId,
      patientId,
      therapistId,
      sessionDate,
      sessionDuration: sessionDuration || 50,
      sessionType: sessionType || 'In-Person',
      therapyNotes: therapyNotes || '',
      patientSummary: patientSummary || 'Session completed. Progressing in therapy goals.',
      progressLevel: progressLevel || 'Progressing Well',
      homeworkAssigned: homeworkAssigned || '',
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate || null,
    });

    // Automatically mark the appointment as 'Completed'
    await Appointment.update({ status: 'Completed' }, { where: { id: appointmentId } });

    // Update active treatment plan session count if exists
    const activePlan = await TreatmentPlan.findOne({
      where: { patientId, therapistId, status: 'Active' },
    });
    if (activePlan) {
      activePlan.completedSessions += 1;
      if (activePlan.recommendedSessions > 0) {
        activePlan.progressPercentage = Math.min(
          100,
          Math.round((activePlan.completedSessions / activePlan.recommendedSessions) * 100)
        );
      }
      await activePlan.save();
    }

    res.status(201).json({
      success: true,
      message: 'Therapy session recorded successfully.',
      session: newSession,
    });
  } catch (error) {
    next(error);
  }
};

// Update Session
exports.updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await TherapySession.findByPk(id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const {
      sessionDuration,
      therapyNotes,
      patientSummary,
      progressLevel,
      homeworkAssigned,
      followUpRequired,
      followUpDate,
    } = req.body;

    await session.update({
      sessionDuration: sessionDuration !== undefined ? sessionDuration : session.sessionDuration,
      therapyNotes: therapyNotes !== undefined ? therapyNotes : session.therapyNotes,
      patientSummary: patientSummary !== undefined ? patientSummary : session.patientSummary,
      progressLevel: progressLevel !== undefined ? progressLevel : session.progressLevel,
      homeworkAssigned: homeworkAssigned !== undefined ? homeworkAssigned : session.homeworkAssigned,
      followUpRequired: followUpRequired !== undefined ? followUpRequired : session.followUpRequired,
      followUpDate: followUpDate !== undefined ? followUpDate : session.followUpDate,
    });

    res.json({
      success: true,
      message: 'Session updated successfully.',
      session,
    });
  } catch (error) {
    next(error);
  }
};
