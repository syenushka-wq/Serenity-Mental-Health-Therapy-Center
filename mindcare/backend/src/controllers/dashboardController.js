const { Op } = require('sequelize');
const {
  Patient,
  Therapist,
  Appointment,
  TherapySession,
  TreatmentPlan,
  Payment,
  User,
  Service,
} = require('../models');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const role = req.user.role;

    // --- ADMIN STATS ---
    if (role === 'Admin') {
      const [
        totalPatients,
        totalTherapists,
        todayAppointments,
        completedSessions,
        recentAppointments,
        recentPatients,
        allPayments,
        allAppointments,
      ] = await Promise.all([
        Patient.count({ where: { status: 'Active' } }),
        Therapist.count({ where: { status: 'Active' } }),
        Appointment.count({ where: { date: today } }),
        TherapySession.count(),
        Appointment.findAll({
          limit: 5,
          order: [['date', 'DESC'], ['timeSlot', 'DESC']],
          include: [
            { model: Patient, as: 'patient', attributes: ['id', 'fullName'] },
            { model: Therapist, as: 'therapist', attributes: ['id', 'fullName'] },
          ],
        }),
        Patient.findAll({
          limit: 5,
          order: [['createdAt', 'DESC']],
        }),
        Payment.findAll({
          where: { paymentStatus: 'Paid' },
          attributes: ['amount', 'paymentDate'],
        }),
        Appointment.findAll({
          attributes: ['date', 'status'],
        }),
      ]);

      const totalRevenue = allPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

      // Monthly Revenue Chart data (Last 6 months)
      const monthlyRevenueMap = {};
      allPayments.forEach((p) => {
        const month = (p.paymentDate || '').substring(0, 7);
        if (month) monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + parseFloat(p.amount || 0);
      });

      // Appointment Status Distribution
      const statusCounts = {};
      allAppointments.forEach((a) => {
        statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
      });

      return res.json({
        success: true,
        stats: {
          totalPatients,
          totalTherapists,
          todayAppointments,
          completedSessions,
          totalRevenue: totalRevenue.toFixed(2),
          recentAppointments,
          recentPatients,
          monthlyRevenueMap,
          statusCounts,
        },
      });
    }

    // --- THERAPIST STATS ---
    if (role === 'Therapist') {
      const therapist = req.user.therapistProfile;
      if (!therapist) {
        return res.json({ success: true, stats: {} });
      }

      const [todaySessions, upcomingAppointments, assignedPatients, pendingPlans, recentSessions] =
        await Promise.all([
          Appointment.count({
            where: { therapistId: therapist.id, date: today, status: { [Op.ne]: 'Cancelled' } },
          }),
          Appointment.findAll({
            where: { therapistId: therapist.id, date: { [Op.gte]: today }, status: { [Op.ne]: 'Cancelled' } },
            limit: 5,
            order: [['date', 'ASC'], ['timeSlot', 'ASC']],
            include: [{ model: Patient, as: 'patient', attributes: ['id', 'fullName', 'phone'] }],
          }),
          Appointment.findAll({
            where: { therapistId: therapist.id },
            attributes: ['patientId'],
            group: ['patientId'],
          }),
          TreatmentPlan.count({
            where: { therapistId: therapist.id, status: 'Active' },
          }),
          TherapySession.findAll({
            where: { therapistId: therapist.id },
            limit: 5,
            order: [['sessionDate', 'DESC']],
            include: [{ model: Patient, as: 'patient', attributes: ['id', 'fullName'] }],
          }),
        ]);

      return res.json({
        success: true,
        stats: {
          todaySessions,
          upcomingAppointments,
          assignedPatientsCount: assignedPatients.length,
          pendingPlans,
          recentSessions,
        },
      });
    }

    // --- RECEPTIONIST STATS ---
    if (role === 'Receptionist') {
      const [todayTotal, todayPending, todayConfirmed, pendingPayments, todaySchedule] =
        await Promise.all([
          Appointment.count({ where: { date: today } }),
          Appointment.count({ where: { date: today, status: 'Pending' } }),
          Appointment.count({ where: { date: today, status: 'Confirmed' } }),
          Payment.count({ where: { paymentStatus: 'Pending' } }),
          Appointment.findAll({
            where: { date: today },
            order: [['timeSlot', 'ASC']],
            include: [
              { model: Patient, as: 'patient', attributes: ['id', 'patientCode', 'fullName', 'phone'] },
              { model: Therapist, as: 'therapist', attributes: ['id', 'fullName', 'specialization'] },
            ],
          }),
        ]);

      return res.json({
        success: true,
        stats: {
          todayTotal,
          todayPending,
          todayConfirmed,
          pendingPayments,
          todaySchedule,
        },
      });
    }

    // --- PATIENT STATS ---
    if (role === 'Patient') {
      const patient = req.user.patientProfile;
      if (!patient) {
        return res.json({ success: true, stats: {} });
      }

      const [nextAppointment, previousSessions, activePlan, payments] = await Promise.all([
        Appointment.findOne({
          where: { patientId: patient.id, date: { [Op.gte]: today }, status: { [Op.ne]: 'Cancelled' } },
          order: [['date', 'ASC'], ['timeSlot', 'ASC']],
          include: [
            { model: Therapist, as: 'therapist', attributes: ['id', 'fullName', 'specialization', 'phone', 'email'] },
            { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
          ],
        }),
        TherapySession.findAll({
          where: { patientId: patient.id },
          limit: 5,
          order: [['sessionDate', 'DESC']],
          attributes: ['id', 'sessionCode', 'sessionDate', 'sessionDuration', 'sessionType', 'patientSummary', 'progressLevel', 'homeworkAssigned'],
          include: [{ model: Therapist, as: 'therapist', attributes: ['id', 'fullName', 'specialization'] }],
        }),
        TreatmentPlan.findOne({
          where: { patientId: patient.id, status: 'Active' },
          include: [{ model: Therapist, as: 'therapist', attributes: ['id', 'fullName'] }],
        }),
        Payment.findAll({
          where: { patientId: patient.id },
          limit: 5,
          order: [['paymentDate', 'DESC']],
        }),
      ]);

      return res.json({
        success: true,
        stats: {
          nextAppointment,
          previousSessions,
          activePlan,
          payments,
        },
      });
    }

    res.json({ success: true, stats: {} });
  } catch (error) {
    next(error);
  }
};
