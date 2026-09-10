const bcrypt = require('bcryptjs');
const { initDatabase } = require('../config/database');
const {
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
} = require('../models');

async function seedDatabase() {
  console.log('🌱 Starting MindCare Database Seeding...');
  await initDatabase();

  // Sync schema
  const { sequelize } = require('../models');
  await sequelize.sync({ force: true });
  console.log('✨ Database tables synced (fresh schema created).');

  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123', salt);
  const therapistPassword = await bcrypt.hash('Therapist@123', salt);
  const receptionPassword = await bcrypt.hash('Reception@123', salt);
  const patientPassword = await bcrypt.hash('Patient@123', salt);

  // 1. Create Users
  const adminUser = await User.create({
    username: 'admin_mindcare',
    email: 'admin@mindcare.com',
    password: adminPassword,
    role: 'Admin',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const therapistUser1 = await User.create({
    username: 'dr_sarah',
    email: 'therapist@mindcare.com',
    password: therapistPassword,
    role: 'Therapist',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  });

  const therapistUser2 = await User.create({
    username: 'dr_chen',
    email: 'david.chen@mindcare.com',
    password: therapistPassword,
    role: 'Therapist',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  });

  const receptionistUser = await User.create({
    username: 'reception_mark',
    email: 'receptionist@mindcare.com',
    password: receptionPassword,
    role: 'Receptionist',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  });

  const patientUser1 = await User.create({
    username: 'emily_clark',
    email: 'patient@mindcare.com',
    password: patientPassword,
    role: 'Patient',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  });

  const patientUser2 = await User.create({
    username: 'marcus_v',
    email: 'marcus.vance@gmail.com',
    password: patientPassword,
    role: 'Patient',
    status: 'Active',
  });

  // 2. Create Therapists
  const therapist1 = await Therapist.create({
    therapistCode: 'TH-2001',
    userId: therapistUser1.id,
    fullName: 'Dr. Sarah Jenkins, Ph.D.',
    email: 'therapist@mindcare.com',
    phone: '+1 (555) 234-5678',
    specialization: 'Cognitive Behavioral Therapy (CBT), Anxiety & Trauma',
    qualification: 'Ph.D. in Clinical Psychology, Licensed Clinical Psychologist (LCP)',
    experience: '12 years of clinical practice in emotional regulation & CBT',
    bio: 'Dr. Jenkins specializes in trauma-informed psychotherapy, guiding clients through depression, anxiety disorders, and major life transitions using evidence-based CBT and mindfulness protocols.',
    hourlyRate: 85.00,
    status: 'Active',
  });

  const therapist2 = await Therapist.create({
    therapistCode: 'TH-2002',
    userId: therapistUser2.id,
    fullName: 'Dr. David Chen, Psy.D.',
    email: 'david.chen@mindcare.com',
    phone: '+1 (555) 876-5432',
    specialization: 'Adolescent Counseling, ADHD, Family Dynamics',
    qualification: 'Psy.D. in Child & Adolescent Clinical Psychology',
    experience: '8 years clinical experience',
    bio: 'Dedicated to helping teenagers and young adults build resilience, navigate academic and social stressors, and foster positive family relationships.',
    hourlyRate: 75.00,
    status: 'Active',
  });

  // 3. Create Services
  const service1 = await Service.create({
    serviceCode: 'SRV-101',
    name: 'Individual Cognitive Behavioral Therapy (CBT)',
    description: 'Structured, evidence-based therapy helping clients modify unhelpful thinking and behavioral patterns.',
    durationMinutes: 50,
    price: 85.00,
    category: 'Individual Therapy',
  });

  const service2 = await Service.create({
    serviceCode: 'SRV-102',
    name: 'Anxiety & Panic Management Program',
    description: 'Targeted interventions incorporating exposure therapy, somatic breathwork, and emotional regulation.',
    durationMinutes: 50,
    price: 80.00,
    category: 'Specialized Care',
  });

  const service3 = await Service.create({
    serviceCode: 'SRV-103',
    name: 'Couples & Relationship Counseling',
    description: 'Facilitating collaborative communication, rebuilding trust, and resolving recurring relationship conflicts.',
    durationMinutes: 60,
    price: 95.00,
    category: 'Couples Therapy',
  });

  const service4 = await Service.create({
    serviceCode: 'SRV-104',
    name: 'Mindfulness-Based Stress Reduction (MBSR)',
    description: 'Cultivating present-moment awareness and mindfulness exercises to combat burnout and chronic stress.',
    durationMinutes: 45,
    price: 70.00,
    category: 'Wellness & Mindfulness',
  });

  // 4. Create Patients
  const patient1 = await Patient.create({
    patientCode: 'PT-1001',
    userId: patientUser1.id,
    fullName: 'Emily Clark',
    dob: '1996-04-12',
    gender: 'Female',
    phone: '+1 (555) 345-9876',
    email: 'patient@mindcare.com',
    address: '742 Evergreen Terrace, Springfield',
    emergencyContact: 'Robert Clark (Father) - +1 (555) 345-9877',
    registrationDate: '2026-01-15',
    status: 'Active',
    medicalHistory: 'Generalized Anxiety Disorder (GAD). Occasional sleep disruption.',
    allergies: 'None',
  });

  const patient2 = await Patient.create({
    patientCode: 'PT-1002',
    userId: patientUser2.id,
    fullName: 'Marcus Vance',
    dob: '1989-11-23',
    gender: 'Male',
    phone: '+1 (555) 765-4321',
    email: 'marcus.vance@gmail.com',
    address: '108 Ocean Drive, Bayview',
    emergencyContact: 'Elena Vance (Spouse) - +1 (555) 765-4322',
    registrationDate: '2026-02-01',
    status: 'Active',
    medicalHistory: 'Work-related burnout, mild depressive symptoms.',
    allergies: 'Penicillin',
  });

  const patient3 = await Patient.create({
    patientCode: 'PT-1003',
    fullName: 'Sophia Williams',
    dob: '2001-08-19',
    gender: 'Female',
    phone: '+1 (555) 908-1122',
    email: 'sophia.w@example.com',
    address: '42 Pine Crest Avenue, Oakville',
    emergencyContact: 'Martha Williams (Mother) - +1 (555) 908-1123',
    registrationDate: '2026-03-10',
    status: 'Active',
    medicalHistory: 'Social anxiety and academic pressure.',
    allergies: 'None',
  });

  // 5. Create Treatment Plans
  const plan1 = await TreatmentPlan.create({
    planCode: 'TP-4001',
    patientId: patient1.id,
    therapistId: therapist1.id,
    title: 'Anxiety Alleviation & Cognitive Reframing Plan',
    diagnosis: 'Generalized Anxiety Disorder (F41.1)',
    startDate: '2026-02-01',
    endDate: '2026-06-01',
    goals: '1. Recognize cognitive distortions (catastrophizing) in daily triggers.\n2. Master diaphragmatic breathing and progressive muscle relaxation.\n3. Increase social comfort rating from 4/10 to 8/10.\n4. Maintain daily thought-journaling log.',
    recommendedSessions: 8,
    completedSessions: 3,
    progressPercentage: 40,
    status: 'Active',
  });

  const plan2 = await TreatmentPlan.create({
    planCode: 'TP-4002',
    patientId: patient2.id,
    therapistId: therapist1.id,
    title: 'Burnout Recovery & Stress Regulation Plan',
    diagnosis: 'Occupational Burnout & Adjustment Reaction (Z73.0)',
    startDate: '2026-02-15',
    endDate: '2026-05-30',
    goals: '1. Establish firm work-life boundaries and scheduled screen-free evening routines.\n2. Reconnect with physical recreation.\n3. Develop assertive communication techniques.',
    recommendedSessions: 6,
    completedSessions: 2,
    progressPercentage: 35,
    status: 'Active',
  });

  // Dates for realism
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const pastDate1 = '2026-03-15';
  const pastDate2 = '2026-03-25';

  // 6. Create Appointments
  const apt1 = await Appointment.create({
    appointmentCode: 'APT-5001',
    patientId: patient1.id,
    therapistId: therapist1.id,
    serviceId: service1.id,
    date: pastDate1,
    timeSlot: '10:00 AM - 10:50 AM',
    sessionType: 'In-Person',
    reason: 'Initial consultation and intake interview for anxiety management',
    status: 'Completed',
    notes: 'Intake completed smoothly. Established therapeutic baseline.',
  });

  const apt2 = await Appointment.create({
    appointmentCode: 'APT-5002',
    patientId: patient1.id,
    therapistId: therapist1.id,
    serviceId: service1.id,
    date: pastDate2,
    timeSlot: '10:00 AM - 10:50 AM',
    sessionType: 'In-Person',
    reason: 'Follow-up CBT session: cognitive restructuring',
    status: 'Completed',
    notes: 'Patient completed thought record exercise diligently.',
  });

  const aptToday = await Appointment.create({
    appointmentCode: 'APT-5003',
    patientId: patient1.id,
    therapistId: therapist1.id,
    serviceId: service1.id,
    date: today,
    timeSlot: '02:00 PM - 02:50 PM',
    sessionType: 'In-Person',
    reason: 'Bi-weekly therapy check-in and situational exposure review',
    status: 'Confirmed',
    notes: 'Confirmed by phone today.',
  });

  const aptTomorrow = await Appointment.create({
    appointmentCode: 'APT-5004',
    patientId: patient2.id,
    therapistId: therapist2.id,
    serviceId: service2.id,
    date: tomorrow,
    timeSlot: '11:00 AM - 11:50 AM',
    sessionType: 'Online Video',
    reason: 'Stress mitigation and boundary-setting strategies',
    status: 'Confirmed',
    notes: 'Telehealth link prepared and sent.',
  });

  const aptFuture = await Appointment.create({
    appointmentCode: 'APT-5005',
    patientId: patient3.id,
    therapistId: therapist1.id,
    serviceId: service1.id,
    date: nextWeek,
    timeSlot: '09:00 AM - 09:50 AM',
    sessionType: 'In-Person',
    reason: 'Assessment of social anxiety symptoms and academic stress',
    status: 'Pending',
    notes: 'Awaiting receptionist confirmation.',
  });

  // 7. Create Therapy Sessions
  await TherapySession.create({
    sessionCode: 'SES-3001',
    appointmentId: apt1.id,
    patientId: patient1.id,
    therapistId: therapist1.id,
    sessionDate: pastDate1,
    sessionDuration: 50,
    sessionType: 'In-Person',
    therapyNotes: 'Patient presented with situational anxious arousal triggered by deadlines. Affect was slightly constricted. Introduced the CBT triangle (Thoughts, Feelings, Behaviors). Patient responded positively to somatic grounding techniques.',
    patientSummary: 'Completed clinical intake. Discussed the relationship between thoughts and feelings. Practiced deep breathing exercises.',
    progressLevel: 'Initial Assessment',
    homeworkAssigned: 'Keep a 3-column daily log of anxiety-triggering thoughts.',
    followUpRequired: true,
    followUpDate: pastDate2,
  });

  await TherapySession.create({
    sessionCode: 'SES-3002',
    appointmentId: apt2.id,
    patientId: patient1.id,
    therapistId: therapist1.id,
    sessionDate: pastDate2,
    sessionDuration: 50,
    sessionType: 'In-Person',
    therapyNotes: 'Patient brought completed thought records. Successfully identified all-or-nothing cognitive distortion. Practiced cognitive reframing with positive self-talk statements. Reported sleep latency decreased from 60 mins to 25 mins.',
    patientSummary: 'Reviewed thought log. Worked on cognitive reframing strategies to replace unhelpful thoughts with balanced perspectives.',
    progressLevel: 'Progressing Well',
    homeworkAssigned: 'Complete reframing worksheet whenever high anxiety is experienced.',
    followUpRequired: true,
    followUpDate: today,
  });

  // 8. Create Payments
  await Payment.create({
    paymentCode: 'PAY-8001',
    patientId: patient1.id,
    appointmentId: apt1.id,
    amount: 85.00,
    paymentDate: pastDate1,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    referenceNumber: 'TXN-CARD-994821',
    notes: 'Paid at front desk via Visa terminal.',
  });

  await Payment.create({
    paymentCode: 'PAY-8002',
    patientId: patient1.id,
    appointmentId: apt2.id,
    amount: 85.00,
    paymentDate: pastDate2,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    referenceNumber: 'TXN-CARD-994890',
    notes: 'Paid online via patient portal.',
  });

  await Payment.create({
    paymentCode: 'PAY-8003',
    patientId: patient2.id,
    appointmentId: aptTomorrow.id,
    amount: 80.00,
    paymentDate: today,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Pending',
    referenceNumber: 'TXN-BNK-334102',
    notes: 'Direct bank transfer invoice pending reconciliation.',
  });

  // 9. System Settings
  await SystemSetting.bulkCreate([
    { settingKey: 'clinic_name', settingValue: 'MindCare Mental Health Therapy Center', description: 'Official Clinic Name' },
    { settingKey: 'clinic_tagline', settingValue: 'Supporting Better Mental Wellness Through Connected Care', description: 'Clinic Tagline' },
    { settingKey: 'clinic_phone', settingValue: '+1 (800) 555-CARE (2273)', description: 'Helpline Number' },
    { settingKey: 'clinic_email', settingValue: 'support@mindcare.com', description: 'Contact Email' },
    { settingKey: 'emergency_helpline', settingValue: '1926 (24/7 National Mental Health Helpline)', description: 'Crisis Hotline' },
  ]);

  console.log('🎉 MindCare Database Seeded Successfully with demo accounts:');
  console.log('   Admin:        admin@mindcare.com        / Admin@123');
  console.log('   Therapist:    therapist@mindcare.com    / Therapist@123');
  console.log('   Receptionist: receptionist@mindcare.com / Reception@123');
  console.log('   Patient:      patient@mindcare.com      / Patient@123');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding error:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
