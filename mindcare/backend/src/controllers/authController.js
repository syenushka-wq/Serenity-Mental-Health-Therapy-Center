const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Patient, Therapist } = require('../models');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'mindcare_super_secret_jwt_key_2026_se_exam',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role, fullName, phone, gender, dob, address, emergencyContact } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username already taken.' });
    }

    // Role safety: public registration defaults to 'Patient' unless requested by Admin
    let userRole = 'Patient';
    if (role && ['Admin', 'Therapist', 'Receptionist', 'Patient'].includes(role)) {
      if (req.user && req.user.role === 'Admin') {
        userRole = role;
      }
    }

    // Create User
    const newUser = await User.create({
      username,
      email,
      password,
      role: userRole,
      status: 'Active',
    });

    // If Patient role, create associated Patient record
    let patientRecord = null;
    if (userRole === 'Patient') {
      const patientCount = await Patient.count();
      const patientCode = `PT-${String(1001 + patientCount).padStart(4, '0')}`;

      patientRecord = await Patient.create({
        patientCode,
        userId: newUser.id,
        fullName: fullName || username,
        dob: dob || null,
        gender: gender || 'Other',
        phone: phone || '',
        email: email,
        address: address || '',
        emergencyContact: emergencyContact || '',
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      });
    }

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        patientProfile: patientRecord,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// Controller: User Authentication (Login)
// Examiner Question: "Explain how login authentication works."
// ============================================================================
exports.login = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // STEP 1: Validate that both username/email and password are provided
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/username and password.' });
    }

    // STEP 2: Query database via Sequelize to find the user by email or username
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email: usernameOrEmail },
          { username: usernameOrEmail },
        ],
      },
      include: [
        { model: Patient, as: 'patientProfile' },
        { model: Therapist, as: 'therapistProfile' },
      ],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // STEP 3: Verify password using bcryptjs (compares plain text with stored hash)
    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    // STEP 4: Check if account status is Active
    if (user.status !== 'Active') {
      return res.status(403).json({ success: false, message: 'Account is suspended or inactive.' });
    }

    // STEP 5: Generate digitally signed JWT token containing user id and role
    const token = generateToken(user);

    // STEP 6: Send back HTTP 200 OK response with the JWT token and user profile
    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        patientProfile: user.patientProfile,
        therapistProfile: user.therapistProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Current User Profile
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Patient, as: 'patientProfile' },
        { model: Therapist, as: 'therapistProfile' },
      ],
      attributes: { exclude: ['password'] },
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { email, password, avatar } = req.body;
    const user = await User.findByPk(req.user.id);

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already used by another account.' });
      }
      user.email = email;
    }

    if (avatar) user.avatar = avatar;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};
