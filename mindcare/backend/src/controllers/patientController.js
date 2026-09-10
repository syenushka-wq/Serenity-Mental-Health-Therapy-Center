const { Op } = require('sequelize');
const {
  Patient,
  User,
  Appointment,
  TherapySession,
  TreatmentPlan,
  Payment,
  Therapist,
  Service,
} = require('../models');

// Get All Patients with search and filter
exports.getAllPatients = async (req, res, next) => {
  try {
    const { search, status, gender, page = 1, limit = 20 } = req.query;
    const where = {};

    if (status && status !== 'All') {
      where.status = status;
    }

    if (gender && gender !== 'All') {
      where.gender = gender;
    }

    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { patientCode: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: patients } = await Patient.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'status'] },
        {
          model: Appointment,
          as: 'appointments',
          attributes: ['id', 'date', 'status'],
          limit: 1,
          order: [['date', 'DESC']],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json({
      success: true,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      patients,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Patient by ID with FULL Comprehensive Profile
exports.getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email', 'status', 'avatar'] },
        {
          model: Appointment,
          as: 'appointments',
          include: [
            { model: Therapist, as: 'therapist', attributes: ['id', 'fullName', 'specialization'] },
            { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
          ],
          order: [['date', 'DESC']],
        },
        {
          model: TherapySession,
          as: 'sessions',
          include: [
            { model: Therapist, as: 'therapist', attributes: ['id', 'fullName', 'specialization'] },
          ],
          order: [['sessionDate', 'DESC']],
        },
        {
          model: TreatmentPlan,
          as: 'treatmentPlans',
          include: [
            { model: Therapist, as: 'therapist', attributes: ['id', 'fullName', 'specialization'] },
          ],
          order: [['createdAt', 'DESC']],
        },
        {
          model: Payment,
          as: 'payments',
          order: [['paymentDate', 'DESC']],
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    // Role check: Patient can only view their own profile
    if (req.user.role === 'Patient' && (!req.user.patientProfile || req.user.patientProfile.id !== patient.id)) {
      return res.status(403).json({ success: false, message: 'Access denied to other patient profiles.' });
    }

    // Sanitize sessions for patients (hide raw clinical notes, show patient summary)
    if (req.user.role === 'Patient' && patient.sessions) {
      patient.sessions.forEach((s) => {
        s.therapyNotes = undefined; // Protect clinical confidential notes
      });
    }

    res.json({
      success: true,
      patient,
    });
  } catch (error) {
    next(error);
  }
};

// Create New Patient
exports.createPatient = async (req, res, next) => {
  try {
    const {
      fullName,
      dob,
      gender,
      phone,
      email,
      address,
      emergencyContact,
      medicalHistory,
      allergies,
    } = req.body;

    if (!fullName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone, and email are required.',
      });
    }

    // Check duplicate email
    const existingPatient = await Patient.findOne({ where: { email } });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient with this email already exists.',
      });
    }

    const patientCount = await Patient.count();
    const patientCode = `PT-${String(1001 + patientCount).padStart(4, '0')}`;

    const newPatient = await Patient.create({
      patientCode,
      fullName,
      dob: dob || null,
      gender: gender || 'Other',
      phone,
      email,
      address: address || '',
      emergencyContact: emergencyContact || '',
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      medicalHistory: medicalHistory || '',
      allergies: allergies || '',
    });

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully.',
      patient: newPatient,
    });
  } catch (error) {
    next(error);
  }
};

// Update Patient
exports.updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const {
      fullName,
      dob,
      gender,
      phone,
      email,
      address,
      emergencyContact,
      status,
      medicalHistory,
      allergies,
    } = req.body;

    await patient.update({
      fullName: fullName !== undefined ? fullName : patient.fullName,
      dob: dob !== undefined ? dob : patient.dob,
      gender: gender !== undefined ? gender : patient.gender,
      phone: phone !== undefined ? phone : patient.phone,
      email: email !== undefined ? email : patient.email,
      address: address !== undefined ? address : patient.address,
      emergencyContact: emergencyContact !== undefined ? emergencyContact : patient.emergencyContact,
      status: status !== undefined ? status : patient.status,
      medicalHistory: medicalHistory !== undefined ? medicalHistory : patient.medicalHistory,
      allergies: allergies !== undefined ? allergies : patient.allergies,
    });

    res.json({
      success: true,
      message: 'Patient updated successfully.',
      patient,
    });
  } catch (error) {
    next(error);
  }
};

// Delete or Deactivate Patient
exports.deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    // Instead of hard delete, deactivate to protect historical clinical records
    patient.status = 'Inactive';
    await patient.save();

    res.json({
      success: true,
      message: 'Patient deactivated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
