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
  IconButton,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { dashboardService } from '../../api';

const AdminDashboard = () => {
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
        console.error('Failed to load admin stats:', err);
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

  // Format monthly revenue data for Recharts
  const monthlyRevenueData = Object.keys(stats?.monthlyRevenueMap || {}).map((month) => ({
    month,
    revenue: stats.monthlyRevenueMap[month],
  }));

  // If empty, supply placeholder months
  const chartData = monthlyRevenueData.length > 0 ? monthlyRevenueData : [
    { month: '2026-01', revenue: 1450 },
    { month: '2026-02', revenue: 2100 },
    { month: '2026-03', revenue: 3200 },
    { month: '2026-04', revenue: 2850 },
  ];

  // Appointment Status distribution data
  const statusData = Object.keys(stats?.statusCounts || {}).map((status) => ({
    status,
    count: stats.statusCounts[status],
  }));

  const statusColors = {
    Confirmed: '#10B981',
    Pending: '#F59E0B',
    Completed: '#0D9488',
    Cancelled: '#EF4444',
    Rescheduled: '#6366F1',
  };

  const getStatusChip = (st) => {
    const color = statusColors[st] || '#64748B';
    return (
      <Chip
        label={st}
        size="small"
        sx={{
          bgcolor: `${color}15`,
          color: color,
          border: `1px solid ${color}40`,
          fontWeight: 700,
        }}
      />
    );
  };

  return (
    <Box>
      {/* Top Welcome & Quick Actions Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
            System Administrator Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Live clinical operations, patient registrations, therapist workload, and revenue metrics.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/patients')}
            sx={{ fontWeight: 600 }}
          >
            Register Patient
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EventAvailableIcon />}
            onClick={() => navigate('/appointments')}
            sx={{ fontWeight: 700 }}
          >
            Schedule Session
          </Button>
        </Stack>
      </Box>

      {/* 5 Core Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: 'Total Patients',
            val: stats?.totalPatients || 0,
            icon: <PeopleIcon sx={{ fontSize: 28, color: '#0D9488' }} />,
            bg: '#F0FDFA',
            route: '/patients',
          },
          {
            label: 'Active Therapists',
            val: stats?.totalTherapists || 0,
            icon: <MedicalServicesIcon sx={{ fontSize: 28, color: '#4F46E5' }} />,
            bg: '#EEF2FF',
            route: '/management/therapists',
          },
          {
            label: "Today's Appointments",
            val: stats?.todayAppointments || 0,
            icon: <EventAvailableIcon sx={{ fontSize: 28, color: '#D97706' }} />,
            bg: '#FFFBEB',
            route: '/appointments',
          },
          {
            label: 'Completed Sessions',
            val: stats?.completedSessions || 0,
            icon: <CheckCircleIcon sx={{ fontSize: 28, color: '#059669' }} />,
            bg: '#ECFDF5',
            route: '/sessions',
          },
          {
            label: 'Monthly Revenue',
            val: `$${parseFloat(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: <MonetizationOnIcon sx={{ fontSize: 28, color: '#0284C7' }} />,
            bg: '#F0F9FF',
            route: '/payments',
          },
        ].map((card, idx) => (
          <Grid item xs={12} sm={6} md={2.4} key={idx}>
            <Card
              onClick={() => navigate(card.route)}
              sx={{
                cursor: 'pointer',
                transition: '0.2s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: card.bg }}>
                    {card.icon}
                  </Box>
                  <ArrowForwardIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                </Box>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
                  {card.val}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {card.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Analytics Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Revenue Trend */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Clinic Revenue Trend ($)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Monthly gross receipts from therapy consultations and programs
                </Typography>
              </Box>
              <Chip label="Live Revenue" color="success" size="small" sx={{ fontWeight: 700 }} />
            </Box>

            <Box sx={{ height: 260, width: '100%', mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    formatter={(val) => [`$${val}`, 'Revenue']}
                    contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Appointment Status Distribution BarChart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
              Appointments by Status
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Live distribution of scheduled therapy sessions
            </Typography>

            <Box sx={{ height: 260, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[entry.status] || '#0D9488'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Appointments & Recent Patients Tables */}
      <Grid container spacing={3}>
        {/* Recent Appointments */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Recent Appointments
              </Typography>
              <Button size="small" onClick={() => navigate('/appointments')}>
                View All
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Therapist</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats?.recentAppointments?.map((apt) => (
                    <TableRow key={apt.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{apt.appointmentCode}</TableCell>
                      <TableCell>{apt.patient?.fullName}</TableCell>
                      <TableCell>{apt.therapist?.fullName}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>
                          {apt.date}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {apt.timeSlot}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(apt.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Patient Registrations */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                New Patient Registrations
              </Typography>
              <Button size="small" onClick={() => navigate('/patients')}>
                View All
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Full Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats?.recentPatients?.map((p) => (
                    <TableRow key={p.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/patients/${p.id}`)}>
                      <TableCell sx={{ fontWeight: 600 }}>{p.patientCode}</TableCell>
                      <TableCell fontWeight={600}>{p.fullName}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell>
                        <Chip label={p.status} size="small" color={p.status === 'Active' ? 'success' : 'default'} sx={{ height: 20, fontSize: '0.7rem' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
