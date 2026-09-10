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
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { dashboardService, appointmentService } from '../../api';

const ReceptionistDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await appointmentService.update(appointmentId, { status: newStatus });
      fetchStats();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

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
            Receptionist Front Desk Operations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage patient arrivals, front desk check-in, appointments scheduling, and payment collection.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/patients')}
            sx={{ fontWeight: 700 }}
          >
            New Patient Registration
          </Button>
          <Button
            variant="outlined"
            startIcon={<EventAvailableIcon />}
            onClick={() => navigate('/appointments')}
            sx={{ fontWeight: 600 }}
          >
            Schedule Appointment
          </Button>
        </Stack>
      </Box>

      {/* 4 Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Today's Total Scheduled", val: stats?.todayTotal || 0, icon: <EventAvailableIcon sx={{ color: '#0D9488' }} />, bg: '#F0FDFA' },
          { label: 'Awaiting Confirmation', val: stats?.todayPending || 0, icon: <PendingActionsIcon sx={{ color: '#D97706' }} />, bg: '#FFFBEB' },
          { label: 'Checked In / Confirmed', val: stats?.todayConfirmed || 0, icon: <CheckCircleIcon sx={{ color: '#10B981' }} />, bg: '#ECFDF5' },
          { label: 'Pending Payment Invoices', val: stats?.pendingPayments || 0, icon: <PaymentIcon sx={{ color: '#0284C7' }} />, bg: '#F0F9FF' },
        ].map((c, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: c.bg }}>{c.icon}</Box>
                  <Typography variant="h4" fontWeight={800}>{c.val}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>{c.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Today's Schedule Table */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="h6" fontWeight={700}>
            Today's Patient Schedule & Front Desk Check-in
          </Typography>
          <Chip label="Live Daily Queue" color="primary" size="small" sx={{ fontWeight: 700 }} />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Time Slot</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Assigned Therapist</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Reception Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats?.todaySchedule?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No appointments scheduled for today.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                stats?.todaySchedule?.map((apt) => (
                  <TableRow key={apt.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{apt.timeSlot}</TableCell>
                    <TableCell fontWeight={600}>{apt.patient?.fullName}</TableCell>
                    <TableCell>{apt.patient?.phone}</TableCell>
                    <TableCell>{apt.therapist?.fullName}</TableCell>
                    <TableCell>
                      <Chip
                        label={apt.status}
                        size="small"
                        color={
                          apt.status === 'Confirmed'
                            ? 'success'
                            : apt.status === 'Pending'
                            ? 'warning'
                            : apt.status === 'Completed'
                            ? 'primary'
                            : 'default'
                        }
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {apt.status === 'Pending' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                          >
                            Confirm Arrival
                          </Button>
                        )}
                        {apt.status === 'Confirmed' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                          >
                            Mark Completed
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => navigate(`/payments?appointmentId=${apt.id}&patientId=${apt.patientId}`)}
                        >
                          Collect Payment
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ReceptionistDashboard;
