// ============================================================================
// MindCare – Mental Health Therapy Center Management System
// File: backend/src/app.js
// Purpose: Main server entry point (Express.js REST API)
// Suitable for: 2nd Semester Software Engineering & ORM Project Evaluation
// ============================================================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { initDatabase } = require('./config/database');
const errorHandler = require('./middleware/errorMiddleware');

// --- 1. Import Route Handlers ---
// In 2nd sem MVC architecture, routes define the URL endpoints and link to controllers
const authRoutes = require('./routes/authRoutes');             // /api/auth (Login, Register, Profile)
const patientRoutes = require('./routes/patientRoutes');       // /api/patients (CRUD, medical history)
const therapistRoutes = require('./routes/therapistRoutes');   // /api/therapists (Clinician profiles, rates)
const appointmentRoutes = require('./routes/appointmentRoutes');// /api/appointments (Booking, double-booking check)
const sessionRoutes = require('./routes/sessionRoutes');       // /api/sessions (Clinical therapy notes, progress)
const treatmentPlanRoutes = require('./routes/treatmentPlanRoutes'); // /api/treatment-plans (Goals, milestones)
const paymentRoutes = require('./routes/paymentRoutes');       // /api/payments (Invoicing, receipts, revenue)
const dashboardRoutes = require('./routes/dashboardRoutes');   // /api/dashboard (Role-based statistics)
const serviceRoutes = require('./routes/serviceRoutes');       // /api/services (Therapy offerings & pricing)
const userRoutes = require('./routes/userRoutes');             // /api/users (Admin account management)

const app = express();

// --- 2. Middlewares ---
// Enable CORS so our React frontend (http://localhost:5173) can communicate with backend
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Parse incoming JSON request bodies (e.g., req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger for console debugging during development
app.use(morgan('dev'));

// --- 3. Mount REST API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/treatment-plans', treatmentPlanRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

// Root Health Check Route (Used to quickly demonstrate backend is healthy in viva)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Healthy',
    system: 'MindCare Mental Health Therapy Center Management System API',
    tagline: 'Supporting Better Mental Wellness Through Connected Care',
    timestamp: new Date().toISOString(),
  });
});

// --- 4. Centralized Error Handler Middleware ---
// Catches any errors passed by next(error) in controllers and returns clean JSON
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// --- 5. Start Server and Initialize Database ---
async function startServer() {
  try {
    // 1. Connect to Database via Sequelize ORM
    await initDatabase();

    // 2. Sync database models with tables
    const { sequelize } = require('./models');
    await sequelize.sync(); 

    // 3. Start listening for HTTP requests
    app.listen(PORT, () => {
      console.log(`\n========================================================`);
      console.log(`🚀 MindCare Backend API is running on http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`========================================================\n`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
