// ============================================================================
// Middleware: JWT Authentication Guard (authMiddleware.js)
// Examiner Question: "How do you protect your API routes using JWT?"
// ============================================================================

const jwt = require('jsonwebtoken');
const { User, Patient, Therapist } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    // STEP 1: Extract Authorization header from incoming HTTP request
    // Format expected: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // STEP 2: If token is missing, reject request with HTTP 401 Unauthorized
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication token missing.',
      });
    }

    // STEP 3: Verify the JWT token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mindcare_super_secret_jwt_key_2026_se_exam');

    // STEP 4: Fetch the authenticated user from the database to ensure account is valid
    const user = await User.findByPk(decoded.id, {
      include: [
        { model: Patient, as: 'patientProfile' },
        { model: Therapist, as: 'therapistProfile' },
      ],
      attributes: { exclude: ['password'] }, // Never attach password hash to req.user
    });

    if (!user || user.status !== 'Active') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive, suspended, or does not exist.',
      });
    }

    // STEP 5: Attach user object to the request (req.user) and proceed to next middleware/controller
    req.user = user;
    next();
  } catch (error) {
    // STEP 6: If token is invalid or expired, return HTTP 401
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      error: error.message,
    });
  }
};

module.exports = authenticateToken;

