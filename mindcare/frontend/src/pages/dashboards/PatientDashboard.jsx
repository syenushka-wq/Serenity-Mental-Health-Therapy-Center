import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  Stack,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { dashboardService, appointmentService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState('');
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await dashboardService.getStats();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled consultation?')) return;
    setCancelling(true);
    try {
      await appointmentService.cancel(appointmentId);
      setCancelSuccess('Appointment has been successfully cancelled.');
      fetchStats();
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const nextApt = stats?.nextAppointment;
  const activePlan = stats?.activePlan;

  return (
    <Box>
      {/* Welcome Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Hello, {user?.patientProfile?.fullName || user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your personal confidential mental wellness space. Track sessions, homework, and treatment milestones.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/appointments')}
          sx={{ fontWeight: 700 }}
        >
          Book New Consultation
        </Button>
      </Box>

      {cancelSuccess && <Alert severity="info" sx={{ mb: 3 }}>{cancelSuccess}</Alert>}

      {/* Row 1: Next Scheduled Consultation & Active Treatment Plan */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Next Appointment Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%', border: '1px solid #CCFBF1', bgcolor: '#F0FDFA' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventAvailableIcon sx={{ color: 'primary.main', fontSize: 26 }} />
                <Typography variant="h6" fontWeight={700} color="primary.dark">
                  Next Scheduled Consultation
                </Typography>
              </Box>
              {nextApt && <Chip label={nextApt.status} color="success" size="small" sx={{ fontWeight: 700 }} />}
            </Box>

            {nextApt ? (
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                  {nextApt.date} at {nextApt.timeSlot}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Format: <strong>{nextApt.sessionType}</strong> • Service: {nextApt.service?.name || 'Individual Psychotherapy'}
                </Typography>

                <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 2, mb: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#0D9488', width: 44, height: 44 }}>
                    {nextApt.therapist?.fullName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {nextApt.therapist?.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {nextApt.therapist?.specialization}
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    disabled={cancelling}
                    onClick={() => handleCancelAppointment(nextApt.id)}
                  >
                    Cancel Appointment
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate('/appointments')}
                  >
                    Reschedule
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  You currently have no upcoming consultations scheduled.
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/appointments')}>
                  Schedule Session Now
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Active Treatment Plan Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon sx={{ color: 'secondary.main', fontSize: 26 }} />
                <Typography variant="h6" fontWeight={700}>
                  My Active Treatment Plan
                </Typography>
              </Box>
              {activePlan && <Chip label="In Progress" color="primary" size="small" sx={{ fontWeight: 700 }} />}
            </Box>

            {activePlan ? (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                  {activePlan.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Supervised by {activePlan.therapist?.fullName} • Target: {activePlan.recommendedSessions} Sessions
                </Typography>

                {/* Progress Bar */}
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                      Therapeutic Milestones Progress
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="primary.main">
                      {activePlan.progressPercentage}% Completed ({activePlan.completedSessions}/{activePlan.recommendedSessions} Sessions)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={activePlan.progressPercentage || 10}
                    sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0' }}
                  />
                </Box>

                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  ACTIVE GOALS & FOCUS AREAS:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', bgcolor: '#F8FAFC', p: 1.5, borderRadius: 2, fontSize: '0.82rem' }}>
                  {activePlan.goals || 'Goals will be defined in your initial assessment session.'}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your licensed therapist will formulate your customized clinical treatment plan after your initial intake.
                </Typography>
                <Button size="small" variant="outlined" onClick={() => navigate('/appointments')}>
                  Book Consultation
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Row 2: Past Sessions and Invoices */}
      <Grid container spacing={3}>
        {/* Previous Sessions Summary */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Recent Therapy Sessions & Patient Takeaways
              </Typography>
              <Button size="small" onClick={() => navigate('/sessions')}>
                View All
              </Button>
            </Box>

            <Stack spacing={2}>
              {stats?.previousSessions?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No completed sessions on record yet.
                </Typography>
              ) : (
                stats?.previousSessions?.map((ses) => (
                  <Box
                    key={ses.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Session on {ses.sessionDate} ({ses.sessionDuration} mins)
                      </Typography>
                      <Chip label={ses.progressLevel} size="small" color="primary" sx={{ height: 20, fontSize: '0.68rem' }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Clinician: {ses.therapist?.fullName}
                    </Typography>
                    <Typography variant="body2" color="#334155" sx={{ mb: 1 }}>
                      <strong>Session Summary:</strong> {ses.patientSummary || 'Progress recorded.'}
                    </Typography>
                    {ses.homeworkAssigned && (
                      <Typography variant="caption" sx={{ bgcolor: '#FEF3C7', color: '#92400E', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
                        📝 <strong>Takeaway Task:</strong> {ses.homeworkAssigned}
                      </Typography>
                    )}
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Payment History */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Receipts & Billing History
              </Typography>
              <Button size="small" onClick={() => navigate('/payments')}>
                All Receipts
              </Button>
            </Box>

            <Stack spacing={2}>
              {stats?.payments?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No billing transactions on record.
                </Typography>
              ) : (
                stats?.payments?.map((pay) => (
                  <Box
                    key={pay.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        ${parseFloat(pay.amount).toFixed(2)} • {pay.paymentMethod}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Date: {pay.paymentDate} • Ref: {pay.referenceNumber || 'N/A'}
                      </Typography>
                    </Box>
                    <Chip
                      label={pay.paymentStatus}
                      size="small"
                      color={pay.paymentStatus === 'Paid' ? 'success' : 'warning'}
                      sx={{ fontWeight: 700, height: 22 }}
                    />
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;
