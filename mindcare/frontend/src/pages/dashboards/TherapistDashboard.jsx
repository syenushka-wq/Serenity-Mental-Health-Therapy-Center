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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { dashboardService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const TherapistDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load therapist stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Welcome back, {user?.therapistProfile?.fullName || user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Specialization: {user?.therapistProfile?.specialization || 'Clinical Psychology'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<NoteAltIcon />}
            onClick={() => navigate('/sessions')}
            sx={{ fontWeight: 700 }}
          >
            Record Clinical Notes
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/treatment-plans')}
            startIcon={<AssignmentIcon />}
            sx={{ fontWeight: 600 }}
          >
            Treatment Plans
          </Button>
        </Stack>
      </Box>

      {/* 4 Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: "Today's Clinical Sessions",
            val: stats?.todaySessions || 0,
            icon: <EventAvailableIcon sx={{ fontSize: 28, color: '#0D9488' }} />,
            bg: '#F0FDFA',
          },
          {
            label: 'Upcoming Scheduled Appointments',
            val: stats?.upcomingAppointments?.length || 0,
            icon: <PsychologyIcon sx={{ fontSize: 28, color: '#4F46E5' }} />,
            bg: '#EEF2FF',
          },
          {
            label: 'Total Assigned Patients',
            val: stats?.assignedPatientsCount || 0,
            icon: <PeopleIcon sx={{ fontSize: 28, color: '#D97706' }} />,
            bg: '#FFFBEB',
          },
          {
            label: 'Active Treatment Plans',
            val: stats?.pendingPlans || 0,
            icon: <AssignmentIcon sx={{ fontSize: 28, color: '#059669' }} />,
            bg: '#ECFDF5',
          },
        ].map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: card.bg }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h4" fontWeight={800}>
                    {card.val}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {card.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Consultations & Recent Clinical Sessions */}
      <Grid container spacing={3}>
        {/* Upcoming Consultations */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Upcoming Appointments Queue
              </Typography>
              <Button size="small" onClick={() => navigate('/appointments')}>
                View Schedule
              </Button>
            </Box>

            <Stack spacing={2}>
              {stats?.upcomingAppointments?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No upcoming appointments scheduled today.
                </Typography>
              ) : (
                stats?.upcomingAppointments?.map((apt) => (
                  <Box
                    key={apt.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {apt.patient?.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {apt.date} • {apt.timeSlot} ({apt.sessionType})
                      </Typography>
                      {apt.reason && (
                        <Typography variant="caption" color="primary.main" sx={{ display: 'block', mt: 0.5 }}>
                          Reason: {apt.reason}
                        </Typography>
                      )}
                    </Box>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/sessions?appointmentId=${apt.id}&patientId=${apt.patientId}`)}
                    >
                      Record Notes
                    </Button>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Session Notes Recorded */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Recent Clinical Session Notes
              </Typography>
              <Button size="small" onClick={() => navigate('/sessions')}>
                Session Log
              </Button>
            </Box>

            <Stack spacing={2}>
              {stats?.recentSessions?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No clinical notes recorded yet.
                </Typography>
              ) : (
                stats?.recentSessions?.map((ses) => (
                  <Box
                    key={ses.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F0FDFA',
                      border: '1px solid #CCFBF1',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight={700} color="#0F766E">
                        {ses.patient?.fullName}
                      </Typography>
                      <Chip label={ses.progressLevel} size="small" color="primary" sx={{ height: 20, fontSize: '0.68rem' }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Date: {ses.sessionDate} • Duration: {ses.sessionDuration} mins
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#1E293B', fontStyle: 'italic' }}>
                      "{ses.therapyNotes?.substring(0, 110)}..."
                    </Typography>
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

export default TherapistDashboard;
