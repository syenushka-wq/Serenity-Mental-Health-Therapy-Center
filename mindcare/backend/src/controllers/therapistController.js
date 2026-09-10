const { Op } = require('sequelize');
const { Therapist, User, Appointment, Patient } = require('../models');

// Get All Therapists with search & filter
exports.getAllTherapists = async (req, res, next) => {
  try {
    const { search, specialization, status } = req.query;
    const where = {};

    if (status && status !== 'All') {
      where.status = status;
    }

    if (specialization && specialization !== 'All') {
      where.specialization = specialization;
    }

    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { specialization: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const therapists = await Therapist.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar', 'status'] },
      ],
      order: [['fullName', 'ASC']],
    });

    res.json({
      success: true,
      therapists,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Therapist by ID
exports.getTherapistById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const therapist = await Therapist.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar', 'status'] },
        {
          model: Appointment,
          as: 'appointments',
          include: [{ model: Patient, as: 'patient', attributes: ['id', 'fullName', 'phone'] }],
          limit: 10,
          order: [['date', 'DESC']],
        },
      ],
    });

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found.' });
    }

    res.json({
      success: true,
      therapist,
    });
  } catch (error) {
    next(error);
  }
};

// Create Therapist
exports.createTherapist = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      specialization,
      qualification,
      experience,
      bio,
      hourlyRate,
      availability,
    } = req.body;

    if (!fullName || !email || !phone || !specialization || !qualification) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, specialization, and qualification are required.',
      });
    }

    const therapistCount = await Therapist.count();
    const therapistCode = `TH-${String(2001 + therapistCount).padStart(4, '0')}`;

    const newTherapist = await Therapist.create({
      therapistCode,
      fullName,
      email,
      phone,
      specialization,
      qualification,
      experience: experience || '3+ years',
      bio: bio || '',
      hourlyRate: hourlyRate || 75.00,
      availability: availability || [
        { day: 'Monday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'] },
        { day: 'Tuesday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'] },
        { day: 'Wednesday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'] },
        { day: 'Thursday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'] },
        { day: 'Friday', slots: ['09:00 AM', '10:30 AM', '02:00 PM'] },
      ],
      status: 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Therapist created successfully.',
      therapist: newTherapist,
    });
  } catch (error) {
    next(error);
  }
};

// Update Therapist
exports.updateTherapist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const therapist = await Therapist.findByPk(id);

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found.' });
    }

    const {
      fullName,
      email,
      phone,
      specialization,
      qualification,
      experience,
      bio,
      hourlyRate,
      availability,
      status,
    } = req.body;

    await therapist.update({
      fullName: fullName !== undefined ? fullName : therapist.fullName,
      email: email !== undefined ? email : therapist.email,
      phone: phone !== undefined ? phone : therapist.phone,
      specialization: specialization !== undefined ? specialization : therapist.specialization,
      qualification: qualification !== undefined ? qualification : therapist.qualification,
      experience: experience !== undefined ? experience : therapist.experience,
      bio: bio !== undefined ? bio : therapist.bio,
      hourlyRate: hourlyRate !== undefined ? hourlyRate : therapist.hourlyRate,
      availability: availability !== undefined ? availability : therapist.availability,
      status: status !== undefined ? status : therapist.status,
    });

    res.json({
      success: true,
      message: 'Therapist updated successfully.',
      therapist,
    });
  } catch (error) {
    next(error);
  }
};

// Delete / Deactivate Therapist
exports.deleteTherapist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const therapist = await Therapist.findByPk(id);

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found.' });
    }

    therapist.status = 'Inactive';
    await therapist.save();

    res.json({
      success: true,
      message: 'Therapist deactivated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
