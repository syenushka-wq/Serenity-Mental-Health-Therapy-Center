const bcrypt = require('bcryptjs');
const { User, Patient, Therapist } = require('../models');

// Get All Users (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, status } = req.query;
    const where = {};
    if (role && role !== 'All') where.role = role;
    if (status && status !== 'All') where.status = status;

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      include: [
        { model: Patient, as: 'patientProfile', attributes: ['id', 'patientCode', 'fullName', 'phone'] },
        { model: Therapist, as: 'therapistProfile', attributes: ['id', 'therapistCode', 'fullName', 'specialization'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Create User (Admin function)
exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, role, status } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      role,
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update User Status or Role
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { role, status, password } = req.body;

    if (role) user.role = role;
    if (status) user.status = status;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
