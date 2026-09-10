const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

// 1. User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { len: [3, 50] },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Therapist', 'Receptionist', 'Patient'),
    allowNull: false,
    defaultValue: 'Patient',
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
    defaultValue: 'Active',
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 2. Patient Model
const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    defaultValue: 'Other',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  emergencyContact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registrationDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Discharged'),
    defaultValue: 'Active',
  },
  medicalHistory: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  allergies: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { timestamps: true });

// 3. Therapist Model
const Therapist = sequelize.define('Therapist', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  therapistCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 75.00,
  },
  availability: {
    type: DataTypes.TEXT, // Store as JSON string for broad DB compatibility
    defaultValue: JSON.stringify([
      { day: 'Monday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'] },
      { day: 'Tuesday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'] },
      { day: 'Thursday', slots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'] },
      { day: 'Friday', slots: ['09:00 AM', '10:30 AM', '02:00 PM'] },
    ]),
    get() {
      const rawValue = this.getDataValue('availability');
      try {
        return rawValue ? JSON.parse(rawValue) : [];
      } catch {
        return [];
      }
    },
    set(val) {
      this.setDataValue('availability', typeof val === 'string' ? val : JSON.stringify(val));
    },
  },
  status: {
    type: DataTypes.ENUM('Active', 'On Leave', 'Inactive'),
    defaultValue: 'Active',
  },
}, { timestamps: true });

// 4. Service Model
const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  serviceCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 65.00,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'Individual Therapy',
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
  },
}, { timestamps: true });

// 5. Appointment Model
const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  appointmentCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  therapistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  timeSlot: {
    type: DataTypes.STRING,
    allowNull: false, // e.g. "10:00 AM - 10:50 AM"
  },
  sessionType: {
    type: DataTypes.ENUM('In-Person', 'Online Video', 'Phone Call'),
    defaultValue: 'In-Person',
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'),
    defaultValue: 'Pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, { timestamps: true });

// 6. TherapySession Model
const TherapySession = sequelize.define('TherapySession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sessionCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  therapistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sessionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  sessionDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  sessionType: {
    type: DataTypes.STRING,
    defaultValue: 'In-Person',
  },
  therapyNotes: {
    type: DataTypes.TEXT,
    allowNull: true, // Confidential therapist clinical notes
  },
  patientSummary: {
    type: DataTypes.TEXT,
    allowNull: true, // Patient visible sanitized takeaways/progress notes
  },
  progressLevel: {
    type: DataTypes.STRING,
    defaultValue: 'Progressing Well',
  },
  homeworkAssigned: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  followUpRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  followUpDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, { timestamps: true });

// 7. TreatmentPlan Model
const TreatmentPlan = sequelize.define('TreatmentPlan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  planCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  therapistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  diagnosis: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  goals: {
    type: DataTypes.TEXT,
    allowNull: true, // JSON or formatted bullet points
  },
  recommendedSessions: {
    type: DataTypes.INTEGER,
    defaultValue: 8,
  },
  completedSessions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  progressPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Completed', 'Paused'),
    defaultValue: 'Active',
  },
}, { timestamps: true });

// 8. Payment Model
const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  paymentCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  paymentMethod: {
    type: DataTypes.ENUM('Cash', 'Card', 'Bank Transfer'),
    defaultValue: 'Card',
  },
  paymentStatus: {
    type: DataTypes.ENUM('Paid', 'Pending', 'Failed'),
    defaultValue: 'Paid',
  },
  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, { timestamps: true });

// 9. Notification Model
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('appointment', 'payment', 'session', 'system'),
    defaultValue: 'system',
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, { timestamps: true });

// 10. SystemSetting Model
const SystemSetting = sequelize.define('SystemSetting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  settingKey: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  settingValue: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { timestamps: true });

// ============================================================================
// --- SEQUELIZE ORM RELATIONSHIPS (ASSOCIATIONS) ---
// Examiner Question: "Explain your database entity relationships and how you defined them in Sequelize ORM."
// ============================================================================

// 1. One-to-One (1:1): User ↔ Patient Profile
User.hasOne(Patient, { foreignKey: 'userId', as: 'patientProfile' });
Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 2. One-to-One (1:1): User ↔ Therapist Profile
User.hasOne(Therapist, { foreignKey: 'userId', as: 'therapistProfile' });
Therapist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 3. One-to-Many (1:N): User ↔ Notifications
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 4. One-to-Many (1:N): Patient ↔ Appointments
// One Patient can have many scheduled Appointments over time.
Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

// 5. One-to-Many (1:N): Patient ↔ Therapy Sessions
Patient.hasMany(TherapySession, { foreignKey: 'patientId', as: 'sessions' });
TherapySession.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

// 6. One-to-Many (1:N): Patient ↔ Treatment Plans
Patient.hasMany(TreatmentPlan, { foreignKey: 'patientId', as: 'treatmentPlans' });
TreatmentPlan.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

// 7. One-to-Many (1:N): Patient ↔ Payments (Billing Records)
Patient.hasMany(Payment, { foreignKey: 'patientId', as: 'payments' });
Payment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

// 8. One-to-Many (1:N): Therapist ↔ Appointments
// One Therapist can have many Appointments with various patients.
Therapist.hasMany(Appointment, { foreignKey: 'therapistId', as: 'appointments' });
Appointment.belongsTo(Therapist, { foreignKey: 'therapistId', as: 'therapist' });

// 9. One-to-Many (1:N): Therapist ↔ Therapy Sessions
Therapist.hasMany(TherapySession, { foreignKey: 'therapistId', as: 'sessions' });
TherapySession.belongsTo(Therapist, { foreignKey: 'therapistId', as: 'therapist' });

// 10. One-to-Many (1:N): Therapist ↔ Treatment Plans
Therapist.hasMany(TreatmentPlan, { foreignKey: 'therapistId', as: 'treatmentPlans' });
TreatmentPlan.belongsTo(Therapist, { foreignKey: 'therapistId', as: 'therapist' });

// 11. One-to-Many (1:N): Service ↔ Appointments
Service.hasMany(Appointment, { foreignKey: 'serviceId', as: 'appointments' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

// 12. One-to-One (1:1): Appointment ↔ Therapy Session
// An appointment results in a dedicated clinical therapy session note record.
Appointment.hasOne(TherapySession, { foreignKey: 'appointmentId', as: 'therapySession' });
TherapySession.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

// 13. One-to-One (1:1): Appointment ↔ Payment Invoice
Appointment.hasOne(Payment, { foreignKey: 'appointmentId', as: 'payment' });
Payment.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'payment' });

module.exports = {
  sequelize,
  User,
  Patient,
  Therapist,
  Service,
  Appointment,
  TherapySession,
  TreatmentPlan,
  Payment,
  Notification,
  SystemSetting,
};
