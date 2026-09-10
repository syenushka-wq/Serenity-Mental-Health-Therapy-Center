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
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { appointmentService, patientService, therapistService, clinicalServices } from '../../api';
import { useAuth } from '../../context/AuthContext';

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterTherapist, setFilterTherapist] = useState(searchParams.get('therapistId') || '');
  const [filterDate, setFilterDate] = useState('');

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: '',
    therapistId: searchParams.get('therapistId') || '',
    serviceId: searchParams.get('serviceId') || '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM - 10:50 AM',
    sessionType: 'In-Person',
    reason: '',
    notes: '',
  });

  const timeSlots = [
    '09:00 AM - 09:50 AM',
    '10:00 AM - 10:50 AM',
    '11:00 AM - 11:50 AM',
    '01:00 PM - 01:50 PM',
    '02:00 PM - 02:50 PM',
    '03:00 PM - 03:50 PM',
    '04:00 PM - 04:50 PM',
  ];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== 'All') params.status = filterStatus;
      if (filterTherapist) params.therapistId = filterTherapist;
      if (filterDate) params.date = filterDate;

      const res = await appointmentService.getAll(params);
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [pRes, tRes, sRes] = await Promise.all([
          user?.role !== 'Patient' ? patientService.getAll({ limit: 100 }) : Promise.resolve({ data: { patients: [] } }),
          therapistService.getAll({ status: 'Active' }),
          clinicalServices.getAll({ status: 'Active' }),
        ]);

        if (pRes.data?.patients) setPatients(pRes.data.patients);
        if (tRes.data?.therapists) setTherapists(tRes.data.therapists);
        if (sRes.data?.services) setServices(sRes.data.services);
      } catch (err) {
        console.error('Error fetching appointment form metadata:', err);
      }
    };

    fetchMetadata();
  }, [user?.role]);

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus, filterTherapist, filterDate]);

  const handleOpenCreate = () => {
    setEditingAppointment(null);
    setDialogError('');
    setFormData({
      patientId: user?.role === 'Patient' ? (user?.patientProfile?.id || '') : '',
      therapistId: therapists[0]?.id || '',
      serviceId: services[0]?.id || '',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: '10:00 AM - 10:50 AM',
      sessionType: 'In-Person',
      reason: '',
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (apt) => {
    setEditingAppointment(apt);
    setDialogError('');
    setFormData({
      patientId: apt.patientId,
      therapistId: apt.therapistId,
      serviceId: apt.serviceId || '',
      date: apt.date,
      timeSlot: apt.timeSlot,
      sessionType: apt.sessionType,
      reason: apt.reason || '',
      notes: apt.notes || '',
      status: apt.status,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogError('');
    setSubmitting(true);

    try {
      if (editingAppointment) {
        await appointmentService.update(editingAppointment.id, formData);
      } else {
        await appointmentService.create(formData);
      }
      setOpenDialog(false);
      fetchAppointments();
    } catch (err) {
      setDialogError(err.response?.data?.message || err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.cancel(id);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickStatus = async (id, status) => {
    try {
      await appointmentService.update(id, { status });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors = {
    Confirmed: 'success',
    Pending: 'warning',
    Completed: 'primary',
    Cancelled: 'error',
    Rescheduled: 'secondary',
  };

  return (
    <Box>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Appointment Management & Scheduling
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage consultations, check therapist real-time availability, and prevent overlapping schedules.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ fontWeight: 700 }}
        >
          Book Appointment
        </Button>
      </Box>

      {/* Filters Bar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              select
              label="Status Filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>

          {user?.role !== 'Therapist' && (
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                fullWidth
                select
                label="Therapist"
                value={filterTherapist}
                onChange={(e) => setFilterTherapist(e.target.value)}
              >
                <MenuItem value="">All Therapists</MenuItem>
                {therapists.map((th) => (
                  <MenuItem key={th.id} value={th.id}>
                    {th.fullName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Filter by Date"
              InputLabelProps={{ shrink: true }}
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={3} sx={{ textAlign: { md: 'right' } }}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                setFilterStatus('All');
                setFilterTherapist('');
                setFilterDate('');
              }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Appointments Data Table */}
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
                  <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Therapist</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date & Time Slot</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Format</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No appointments found matching the selected filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((apt) => (
                    <TableRow key={apt.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                        {apt.appointmentCode}
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {apt.patient?.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {apt.patient?.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {apt.therapist?.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {apt.therapist?.specialization}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {apt.date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {apt.timeSlot}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={apt.sessionType} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={apt.status}
                          size="small"
                          color={statusColors[apt.status] || 'default'}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          {/* Quick confirmation for reception/admin */}
                          {['Admin', 'Receptionist'].includes(user?.role) && apt.status === 'Pending' && (
                            <Tooltip title="Confirm Appointment">
                              <IconButton
                                color="success"
                                size="small"
                                onClick={() => handleQuickStatus(apt.id, 'Confirmed')}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Edit / Reschedule">
                            <IconButton size="small" onClick={() => handleOpenEdit(apt)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                            <Tooltip title="Cancel Appointment">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleCancelAppointment(apt.id)}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create / Edit Appointment Modal */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingAppointment ? 'Edit / Reschedule Appointment' : 'Schedule New Clinical Appointment'}
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}

          <Box component="form" id="appointment-form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2.5}>
              {user?.role !== 'Patient' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Select Patient"
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  >
                    {patients.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.fullName} ({p.patientCode} - {p.phone})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Assigned Clinician / Therapist"
                  required
                  value={formData.therapistId}
                  onChange={(e) => setFormData({ ...formData, therapistId: e.target.value })}
                >
                  {therapists.map((th) => (
                    <MenuItem key={th.id} value={th.id}>
                      {th.fullName} ({th.specialization})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Therapy Program / Service"
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                >
                  {services.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name} (${parseFloat(s.price).toFixed(2)})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Appointment Date"
                  required
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Available Time Slot"
                  required
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                >
                  {timeSlots.map((ts) => (
                    <MenuItem key={ts} value={ts}>
                      {ts}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Consultation Format"
                  value={formData.sessionType}
                  onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                >
                  <MenuItem value="In-Person">In-Person Clinic Visit</MenuItem>
                  <MenuItem value="Online Video">Secure Online Video</MenuItem>
                  <MenuItem value="Phone Call">Phone Consultation</MenuItem>
                </TextField>
              </Grid>

              {editingAppointment && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                    <MenuItem value="Rescheduled">Rescheduled</MenuItem>
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Primary Reason for Visit"
                  multiline
                  rows={2}
                  placeholder="e.g. Follow-up cognitive therapy, acute anxiety review, stress management..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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
            form="appointment-form"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 700 }}
          >
            {submitting ? 'Checking Availability...' : editingAppointment ? 'Update Appointment' : 'Confirm Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentsPage;
