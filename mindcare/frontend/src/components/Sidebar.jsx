import React from 'react';
import { NavLink as RouterNavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import CategoryIcon from '@mui/icons-material/Category';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 260;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = (user?.role || '').toLowerCase();

  // Navigation items based on role
  let navItems = [];

  if (role === 'admin') {
    navItems = [
      { text: 'Admin Overview', path: '/admin', icon: <DashboardIcon /> },
      { text: 'Patients', path: '/patients', icon: <PeopleIcon /> },
      { text: 'Therapists', path: '/management/therapists', icon: <MedicalServicesIcon /> },
      { text: 'Appointments', path: '/appointments', icon: <EventAvailableIcon /> },
      { text: 'Therapy Sessions', path: '/sessions', icon: <PsychologyIcon /> },
      { text: 'Treatment Plans', path: '/treatment-plans', icon: <AssignmentIcon /> },
      { text: 'Billing & Payments', path: '/payments', icon: <PaymentIcon /> },
      { text: 'Therapy Services', path: '/management/services', icon: <CategoryIcon /> },
      { text: 'User Accounts', path: '/management/users', icon: <ManageAccountsIcon /> },
      { text: 'Reports & Analytics', path: '/reports', icon: <BarChartIcon /> },
    ];
  } else if (role === 'therapist') {
    navItems = [
      { text: 'Therapist Dashboard', path: '/therapist', icon: <DashboardIcon /> },
      { text: 'Assigned Patients', path: '/patients', icon: <PeopleIcon /> },
      { text: 'Schedule & Calendar', path: '/appointments', icon: <EventAvailableIcon /> },
      { text: 'Clinical Sessions', path: '/sessions', icon: <PsychologyIcon /> },
      { text: 'Treatment Plans', path: '/treatment-plans', icon: <AssignmentIcon /> },
    ];
  } else if (role === 'receptionist') {
    navItems = [
      { text: 'Reception Overview', path: '/receptionist', icon: <DashboardIcon /> },
      { text: 'Patient Registry', path: '/patients', icon: <PeopleIcon /> },
      { text: 'Daily Appointments', path: '/appointments', icon: <EventAvailableIcon /> },
      { text: 'Billing & Receipts', path: '/payments', icon: <PaymentIcon /> },
      { text: 'Clinic Therapists', path: '/management/therapists', icon: <MedicalServicesIcon /> },
    ];
  } else {
    // Patient
    navItems = [
      { text: 'My Wellness Portal', path: '/patient', icon: <DashboardIcon /> },
      { text: 'Book Appointment', path: '/appointments', icon: <EventAvailableIcon /> },
      { text: 'My Sessions & Notes', path: '/sessions', icon: <PsychologyIcon /> },
      { text: 'My Treatment Plan', path: '/treatment-plans', icon: <AssignmentIcon /> },
      { text: 'Billing & Receipts', path: '/payments', icon: <PaymentIcon /> },
    ];
  }

  const roleColors = {
    admin: { bg: '#FEF3C7', color: '#B45309' },
    therapist: { bg: '#E0F2FE', color: '#0369A1' },
    receptionist: { bg: '#EDE9FE', color: '#6D28D9' },
    patient: { bg: '#D1FAE5', color: '#047857' },
  };

  const badgeStyle = roleColors[role] || { bg: '#F1F5F9', color: '#475569' };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#0F172A', color: '#94A3B8' }}>
      {/* Brand Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1E293B' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <HealthAndSafetyIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.1 }}>
              MindCare
            </Typography>
            <Typography variant="caption" sx={{ color: '#0D9488', fontWeight: 600, fontSize: '0.68rem' }}>
              Management System
            </Typography>
          </Box>
        </Box>
        {mobileOpen && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#94A3B8', display: { md: 'none' } }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* User Info Card */}
      <Box sx={{ p: 2, m: 2, bgcolor: '#1E293B', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          src={user?.avatar}
          sx={{ width: 42, height: 42, bgcolor: 'primary.main', fontWeight: 700, fontSize: '1rem' }}
        >
          {(user?.username || 'U')[0].toUpperCase()}
        </Avatar>
        <Box sx={{ overflow: 'hidden', flex: 1 }}>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.patientProfile?.fullName || user?.therapistProfile?.fullName || user?.username}
          </Typography>
          <Chip
            label={user?.role || 'Guest'}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.68rem',
              fontWeight: 700,
              bgcolor: badgeStyle.bg,
              color: badgeStyle.color,
              mt: 0.5,
            }}
          />
        </Box>
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 1.5, py: 1, flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterNavLink}
                to={item.path}
                onClick={mobileOpen ? handleDrawerToggle : undefined}
                sx={{
                  borderRadius: 2,
                  py: 1.1,
                  px: 1.8,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'rgba(255, 255, 255, 0.05)',
                    color: '#FFFFFF',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#FFFFFF' : '#94A3B8', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#1E293B' }} />

      {/* Public Portal & Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={() => navigate('/')}
          sx={{
            borderRadius: 2,
            mb: 1,
            py: 1,
            color: '#CBD5E1',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)', color: 'white' },
          }}
        >
          <ListItemIcon sx={{ color: '#94A3B8', minWidth: 38 }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Public Website" primaryTypographyProps={{ fontSize: '0.85rem' }} />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            logout();
            navigate('/login');
          }}
          sx={{
            borderRadius: 2,
            py: 1,
            color: '#EF4444',
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
          }}
        >
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 38 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Persistent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid #1E293B' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
