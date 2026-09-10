const { Op } = require('sequelize');
const { Appointment, Patient, Therapist, Service, TherapySession, Payment, Notification } = require('../models');

// Get All Appointments with filtering & role scoping
exports.getAllAppointments = async (req, res, next) => {
  try {
    const { date, startDate, endDate, therapistId, patientId, status, sessionType, search } = req.query;
    const where = {};

    // Role-based scoping:
    if (req.user.role === 'Patient') {
      if (!req.user.patientProfile) {
        return res.json({ success: true, appointments: [] });
      }
      where.patientId = req.user.patientProfile.id;
    } else if (req.user.role === 'Therapist') {
      if (!req.user.therapistProfile) {
        return res.json({ success: true, appointments: [] });
      }
      where.therapistId = req.user.therapistProfile.id;
    }

    if (patientId) where.patientId = patientId;
    if (therapistId) where.therapistId = therapistId;
    if (status && status !== 'All') where.status = status;
    if (sessionType && sessionType !== 'All') where.sessionType = sessionType;

    if (date) {
      where.date = date;
    } else if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    }

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'patientCode', 'fullName', 'phone', 'email', 'gender'] },
        { model: Therapist, as: 'therapist', attributes: ['id', 'therapistCode', 'fullName', 'specialization', 'phone'] },
        { model: Service, as: 'service', attributes: ['id', 'name', 'price', 'durationMinutes'] },
        { model: TherapySession, as: 'therapySession', attributes: ['id', 'sessionCode', 'progressLevel'] },
        { model: Payment, as: 'payment', attributes: ['id', 'paymentCode', 'amount', 'paymentStatus'] },
      ],
      order: [['date', 'ASC'], ['timeSlot', 'ASC']],
    });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Appointment by ID
exports.getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Therapist, as: 'therapist' },
        { model: Service, as: 'service' },
        { model: TherapySession, as: 'therapySession' },
        { model: Payment, as: 'payment' },
      ],
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Authorization check
    if (req.user.role === 'Patient' && req.user.patientProfile && req.user.patientProfile.id !== appointment.patientId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (req.user.role === 'Therapist' && req.user.therapistProfile && req.user.therapistProfile.id !== appointment.therapistId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// Controller: Appointment Booking Logic
// Examiner Question: "Explain how you create an appointment and prevent double-booking."
// ============================================================================
exports.createAppointment = async (req, res, next) => {
  try {
    let {
      patientId,
      therapistId,
      serviceId,
      date,
      timeSlot,
      sessionType,
      reason,
      notes,
    } = req.body;

    // STEP 1: Scoping - If logged-in user is a Patient, assign their own profile ID
    if (req.user.role === 'Patient') {
      if (!req.user.patientProfile) {
        return res.status(400).json({ success: false, message: 'Patient profile not found for this user.' });
      }
      patientId = req.user.patientProfile.id;
    }

    // STEP 2: Input Validation - Check for mandatory fields
    if (!patientId || !therapistId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Patient, Therapist, Date, and Time Slot are required.',
      });
    }

    // STEP 3: Business Validation - Prevent booking past dates
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date cannot be in the past.',
      });
    }

    // STEP 4: Double Booking Check - Check if therapist is already booked at this date and time
    const conflictingAppointment = await Appointment.findOne({
      where: {
        therapistId,
        date,
        timeSlot,
        status: { [Op.notIn]: ['Cancelled'] }, // Ignore cancelled appointments
      },
    });

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This therapist already has an appointment scheduled for this date and time slot. Please select another time or therapist.',
      });
    }

    // STEP 5: Generate unique readable Appointment Code (e.g., APT-5001)
    const appointmentCount = await Appointment.count();
    const appointmentCode = `APT-${String(5001 + appointmentCount).padStart(4, '0')}`;

    // STEP 6: Save the new appointment to the Database via Sequelize ORM
    const newAppointment = await Appointment.create({
      appointmentCode,
      patientId,
      therapistId,
      serviceId: serviceId || null,
      date,
      timeSlot,
      sessionType: sessionType || 'In-Person',
      reason: reason || '',
      notes: notes || '',
      status: req.user.role === 'Patient' ? 'Pending' : 'Confirmed',
    });

    // STEP 7: Create in-system notification for therapist
    const therapist = await Therapist.findByPk(therapistId);
    if (therapist && therapist.userId) {
      await Notification.create({
        userId: therapist.userId,
        title: 'New Appointment Scheduled',
        message: `New appointment on ${date} at ${timeSlot}.`,
        type: 'appointment',
      });
    }

    const createdRecord = await Appointment.findByPk(newAppointment.id, {
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'fullName', 'phone'] },
        { model: Therapist, as: 'therapist', attributes: ['id', 'fullName', 'specialization'] },
        { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      appointment: createdRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Update Appointment (Status, Date/Time Reschedule, Notes)
exports.updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    const {
      date,
      timeSlot,
      sessionType,
      reason,
      status,
      notes,
      therapistId,
      serviceId,
    } = req.body;

    // Check for double booking if date, timeSlot, or therapist is changed
    const targetTherapistId = therapistId || appointment.therapistId;
    const targetDate = date || appointment.date;
    const targetTimeSlot = timeSlot || appointment.timeSlot;

    if (
      (date && date !== appointment.date) ||
      (timeSlot && timeSlot !== appointment.timeSlot) ||
      (therapistId && therapistId !== appointment.therapistId)
    ) {
      const conflict = await Appointment.findOne({
        where: {
          id: { [Op.ne]: appointment.id },
          therapistId: targetTherapistId,
          date: targetDate,
          timeSlot: targetTimeSlot,
          status: { [Op.notIn]: ['Cancelled'] },
        },
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'Selected slot is already booked for this therapist.',
        });
      }
    }

    await appointment.update({
      date: date !== undefined ? date : appointment.date,
      timeSlot: timeSlot !== undefined ? timeSlot : appointment.timeSlot,
      sessionType: sessionType !== undefined ? sessionType : appointment.sessionType,
      reason: reason !== undefined ? reason : appointment.reason,
      status: status !== undefined ? status : appointment.status,
      notes: notes !== undefined ? notes : appointment.notes,
      therapistId: therapistId !== undefined ? therapistId : appointment.therapistId,
      serviceId: serviceId !== undefined ? serviceId : appointment.serviceId,
    });

    const updated = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'fullName', 'phone'] },
        { model: Therapist, as: 'therapist', attributes: ['id', 'fullName', 'specialization'] },
        { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
      ],
    });

    res.json({
      success: true,
      message: 'Appointment updated successfully.',
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Appointment
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully.',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};
