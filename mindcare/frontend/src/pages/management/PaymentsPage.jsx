import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PrintIcon from '@mui/icons-material/Print';
import { paymentService, patientService, appointmentService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const PaymentsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [payments, setPayments] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: searchParams.get('patientId') || '',
    appointmentId: searchParams.get('appointmentId') || '',
    amount: '85.00',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    referenceNumber: '',
    notes: '',
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.paymentStatus = statusFilter;
      if (methodFilter !== 'All') params.paymentMethod = methodFilter;

      const [pRes, sRes] = await Promise.all([
        paymentService.getAll(params),
        ['Admin', 'Receptionist'].includes(user.role)
          ? paymentService.getRevenueSummary()
          : Promise.resolve({ data: { success: false } }),
      ]);

      if (pRes.data.success) {
        setPayments(pRes.data.payments);
      }
      if (sRes.data.success) {
        setRevenueSummary(sRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();

    if (['Admin', 'Receptionist'].includes(user?.role)) {
      patientService.getAll({ limit: 100 }).then((res) => {
        if (res.data?.patients) setPatients(res.data.patients);
      });
      appointmentService.getAll().then((res) => {
        if (res.data?.appointments) setAppointments(res.data.appointments);
      });
    }
  }, [statusFilter, methodFilter, user?.role]);

  // Open modal if URL query params present
  useEffect(() => {
    if (searchParams.get('appointmentId') && searchParams.get('patientId')) {
      setFormData((prev) => ({
        ...prev,
        appointmentId: searchParams.get('appointmentId'),
        patientId: searchParams.get('patientId'),
        referenceNumber: `TXN-INV-${Math.floor(100000 + Math.random() * 900000)}`,
      }));
      setOpenDialog(true);
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    setDialogError('');
    setFormData({
      patientId: patients[0]?.id || (user?.role === 'Patient' ? user?.patientProfile?.id : ''),
      appointmentId: '',
      amount: '85.00',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Card',
      paymentStatus: 'Paid',
      referenceNumber: `TXN-REC-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: 'Consultation fee settlement',
    });
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogError('');
    setSubmitting(true);

    try {
      await paymentService.create(formData);
      setOpenDialog(false);
      fetchPayments();
    } catch (err) {
      setDialogError(err.response?.data?.message || err.message || 'Payment recording failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Billing & Payment Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Process therapy consultation invoices, generate receipts, and track clinic revenue.
          </Typography>
        </Box>
        {['Admin', 'Receptionist', 'Patient'].includes(user?.role) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ fontWeight: 700 }}
          >
            {user?.role === 'Patient' ? 'Make Payment' : 'Record New Payment'}
          </Button>
        )}
      </Box>

      {/* Revenue Summary Banner (Admin & Receptionist) */}
      {revenueSummary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#F0FDFA', border: '1px solid #CCFBF1' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" fontWeight={700} color="#0F766E">
                  TOTAL RECORDED REVENUE
                </Typography>
                <Typography variant="h4" fontWeight={800} color="primary.dark" sx={{ my: 0.5 }}>
                  ${parseFloat(revenueSummary.totalRevenue).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Across all settled consultations & services
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#EEF2FF', border: '1px solid #E0E7FF' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" fontWeight={700} color="#4338CA">
                  TRANSACTION VOLUME
                </Typography>
                <Typography variant="h4" fontWeight={800} color="secondary.dark" sx={{ my: 0.5 }}>
                  {revenueSummary.transactionCount} Invoices
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total settled patient invoices
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#ECFDF5', border: '1px solid #D1FAE5' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" fontWeight={700} color="#047857">
                  SETTLEMENT SUCCESS RATE
                </Typography>
                <Typography variant="h4" fontWeight={800} color="#047857" sx={{ my: 0.5 }}>
                  100%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Zero chargeback disputes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters Bar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Payment Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Payment Method"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <MenuItem value="All">All Methods</MenuItem>
              <MenuItem value="Card">Credit / Debit Card</MenuItem>
              <MenuItem value="Cash">Cash at Reception</MenuItem>
              <MenuItem value="Bank Transfer">Bank Wire Transfer</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                setStatusFilter('All');
                setMethodFilter('All');
              }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Payments Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Receipt #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount ($)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Payment Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Reference</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Receipt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No payment records found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((pay) => (
                    <TableRow key={pay.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                        {pay.paymentCode}
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {pay.patient?.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pay.patient?.patientCode}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                        ${parseFloat(pay.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>{pay.paymentDate}</TableCell>
                      <TableCell>{pay.paymentMethod}</TableCell>
                      <TableCell>{pay.referenceNumber || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={pay.paymentStatus}
                          size="small"
                          color={pay.paymentStatus === 'Paid' ? 'success' : pay.paymentStatus === 'Pending' ? 'warning' : 'error'}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ReceiptIcon />}
                          onClick={() => setViewingReceipt(pay)}
                        >
                          View Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Record Payment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Record Consultation Payment
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}

          <Box component="form" id="payment-form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2.5}>
              {user?.role !== 'Patient' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Patient"
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  >
                    {patients.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.fullName} ({p.patientCode})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Linked Appointment (Optional)"
                  value={formData.appointmentId}
                  onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                >
                  <MenuItem value="">General Advance / Retainer</MenuItem>
                  {appointments.map((a) => (
                    <MenuItem key={a.id} value={a.id}>
                      {a.appointmentCode} — {a.patient?.fullName} on {a.date} ({a.timeSlot})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount ($)"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Payment Date"
                  required
                  InputLabelProps={{ shrink: true }}
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Payment Method"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  <MenuItem value="Card">Credit / Debit Card</MenuItem>
                  <MenuItem value="Cash">Cash at Desk</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Payment Status"
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                >
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Transaction Reference Number"
                  placeholder="e.g. TXN-CARD-992104"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Receipt Notes / Memo"
                  multiline
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form="payment-form"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 700 }}
          >
            {submitting ? 'Processing...' : 'Confirm & Generate Receipt'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Official Receipt Modal */}
      <Dialog open={Boolean(viewingReceipt)} onClose={() => setViewingReceipt(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pb: 0 }}>
          MindCare Therapy Center
        </DialogTitle>
        <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
          Official Clinical Payment Receipt
        </Typography>

        <DialogContent dividers>
          {viewingReceipt && (
            <Paper elevation={0} sx={{ p: 3, border: '1px dashed #CBD5E1', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">
                  Receipt Code: <strong>{viewingReceipt.paymentCode}</strong>
                </Typography>
                <Typography variant="body2">
                  Date: <strong>{viewingReceipt.paymentDate}</strong>
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Stack spacing={1} sx={{ mb: 2.5 }}>
                <Typography variant="body2">
                  Patient Name: <strong>{viewingReceipt.patient?.fullName}</strong> ({viewingReceipt.patient?.patientCode})
                </Typography>
                <Typography variant="body2">
                  Payment Method: <strong>{viewingReceipt.paymentMethod}</strong>
                </Typography>
                <Typography variant="body2">
                  Transaction Ref: <strong>{viewingReceipt.referenceNumber || 'N/A'}</strong>
                </Typography>
                <Typography variant="body2">
                  Status: <strong>{viewingReceipt.paymentStatus}</strong>
                </Typography>
                {viewingReceipt.notes && (
                  <Typography variant="body2" color="text.secondary">
                    Memo: {viewingReceipt.notes}
                  </Typography>
                )}
              </Stack>

              <Box sx={{ p: 2, bgcolor: '#F0FDFA', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Total Paid:
                </Typography>
                <Typography variant="h5" fontWeight={800} color="primary.main">
                  ${parseFloat(viewingReceipt.amount).toFixed(2)}
                </Typography>
              </Box>

              <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ mt: 3 }}>
                Thank you for choosing MindCare. Supporting Better Mental Wellness Through Connected Care.
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button startIcon={<PrintIcon />} onClick={() => window.print()}>
            Print Receipt
          </Button>
          <Button onClick={() => setViewingReceipt(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsPage;
