const { Payment, Patient, Appointment, Therapist, Service } = require('../models');

// Get All Payments
exports.getAllPayments = async (req, res, next) => {
  try {
    const { patientId, paymentStatus, paymentMethod } = req.query;
    const where = {};

    if (req.user.role === 'Patient') {
      if (!req.user.patientProfile) return res.json({ success: true, payments: [] });
      where.patientId = req.user.patientProfile.id;
    }

    if (patientId) where.patientId = patientId;
    if (paymentStatus && paymentStatus !== 'All') where.paymentStatus = paymentStatus;
    if (paymentMethod && paymentMethod !== 'All') where.paymentMethod = paymentMethod;

    const payments = await Payment.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'patientCode', 'fullName', 'phone', 'email'] },
        {
          model: Appointment,
          as: 'appointment',
          include: [
            { model: Therapist, as: 'therapist', attributes: ['id', 'fullName'] },
            { model: Service, as: 'service', attributes: ['id', 'name'] },
          ],
        },
      ],
      order: [['paymentDate', 'DESC']],
    });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// Create / Process Payment
exports.createPayment = async (req, res, next) => {
  try {
    const {
      patientId,
      appointmentId,
      amount,
      paymentDate,
      paymentMethod,
      paymentStatus,
      referenceNumber,
      notes,
    } = req.body;

    if (!patientId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and Amount are required.',
      });
    }

    if (parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than zero.',
      });
    }

    const paymentCount = await Payment.count();
    const paymentCode = `PAY-${String(8001 + paymentCount).padStart(4, '0')}`;

    const newPayment = await Payment.create({
      paymentCode,
      patientId,
      appointmentId: appointmentId || null,
      amount,
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'Card',
      paymentStatus: paymentStatus || 'Paid',
      referenceNumber: referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: notes || '',
    });

    const paymentWithDetails = await Payment.findByPk(newPayment.id, {
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'patientCode', 'fullName', 'email'] },
        { model: Appointment, as: 'appointment' },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully.',
      payment: paymentWithDetails,
    });
  } catch (error) {
    next(error);
  }
};

// Update Payment Status
exports.updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }

    const { paymentStatus, paymentMethod, notes, referenceNumber } = req.body;

    await payment.update({
      paymentStatus: paymentStatus !== undefined ? paymentStatus : payment.paymentStatus,
      paymentMethod: paymentMethod !== undefined ? paymentMethod : payment.paymentMethod,
      notes: notes !== undefined ? notes : payment.notes,
      referenceNumber: referenceNumber !== undefined ? referenceNumber : payment.referenceNumber,
    });

    res.json({
      success: true,
      message: 'Payment updated successfully.',
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// Revenue Summary & Analytics
exports.getRevenueSummary = async (req, res, next) => {
  try {
    const allPaidPayments = await Payment.findAll({
      where: { paymentStatus: 'Paid' },
    });

    const totalRevenue = allPaidPayments.reduce((acc, p) => acc + parseFloat(p.amount || 0), 0);

    // Group by month
    const monthlyRevenue = {};
    allPaidPayments.forEach((p) => {
      const month = (p.paymentDate || '').substring(0, 7); // "YYYY-MM"
      if (month) {
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + parseFloat(p.amount || 0);
      }
    });

    res.json({
      success: true,
      totalRevenue: totalRevenue.toFixed(2),
      transactionCount: allPaidPayments.length,
      monthlyRevenue,
    });
  } catch (error) {
    next(error);
  }
};
