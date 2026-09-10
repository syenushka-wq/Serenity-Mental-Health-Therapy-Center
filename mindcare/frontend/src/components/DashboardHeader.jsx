import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useAuth } from '../context/AuthContext';

const DashboardHeader = ({ handleDrawerToggle, title }) => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElRole, setAnchorElRole] = useState(null);

  // Quick 1-click role switcher for university evaluation / presentation
  const handleQuickSwitchRole = async (targetRole) => {
    setAnchorElRole(null);
    let creds = { usernameOrEmail: 'admin@mindcare.com', password: 'Admin@123' };
    if (targetRole === 'Therapist') creds = { usernameOrEmail: 'therapist@mindcare.com', password: 'Therapist@123' };
    if (targetRole === 'Receptionist') creds = { usernameOrEmail: 'receptionist@mindcare.com', password: 'Reception@123' };
    if (targetRole === 'Patient') creds = { usernameOrEmail: 'patient@mindcare.com', password: 'Patient@123' };

    try {
      await login(creds);
      if (targetRole === 'Admin') navigate('/admin');
      if (targetRole === 'Therapist') navigate('/therapist');
      if (targetRole === 'Receptionist') navigate('/receptionist');
      if (targetRole === 'Patient') navigate('/patient');
    } catch (err) {
      console.error('Role switch failed:', err);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        color: '#0F172A',
        borderBottom: '1px solid #E2E8F0',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        {/* Left: Mobile Toggle & Page Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {title || 'Dashboard'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
              MindCare Mental Health Therapy Center
            </Typography>
          </Box>
        </Box>

        {/* Right: Quick Role Switcher (Academic Demo Tool) + Notifications + User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Quick Role Switcher Chip Button */}
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<SwapHorizIcon />}
            onClick={(e) => setAnchorElRole(e.currentTarget)}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              borderColor: '#CBD5E1',
              bgcolor: '#F8FAFC',
              fontSize: '0.78rem',
              py: 0.4,
              px: 1.2,
            }}
          >
            Role: <strong>{user?.role}</strong>
          </Button>

          <Menu
            anchorEl={anchorElRole}
            open={Boolean(anchorElRole)}
            onClose={() => setAnchorElRole(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                SWITCH DEMO ROLE (1-CLICK)
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => handleQuickSwitchRole('Admin')}>
              <ListItemText primary="Admin" secondary="admin@mindcare.com" />
            </MenuItem>
            <MenuItem onClick={() => handleQuickSwitchRole('Therapist')}>
              <ListItemText primary="Therapist" secondary="therapist@mindcare.com (Dr. Jenkins)" />
            </MenuItem>
            <MenuItem onClick={() => handleQuickSwitchRole('Receptionist')}>
              <ListItemText primary="Receptionist" secondary="receptionist@mindcare.com" />
            </MenuItem>
            <MenuItem onClick={() => handleQuickSwitchRole('Patient')}>
              <ListItemText primary="Patient" secondary="patient@mindcare.com (Emily Clark)" />
            </MenuItem>
          </Menu>

          {/* User Profile Avatar Menu */}
          <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar
              src={user?.avatar}
              sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem', fontWeight: 700 }}
            >
              {(user?.username || 'U')[0].toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ px: 2, py: 1.2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {user?.patientProfile?.fullName || user?.therapistProfile?.fullName || user?.username}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {user?.email}
              </Typography>
              <Chip label={user?.role} size="small" color="primary" sx={{ mt: 0.8, height: 20, fontSize: '0.68rem' }} />
            </Box>
            <Divider />
            <MenuItem onClick={() => { setAnchorElUser(null); navigate('/'); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Public Website" />
            </MenuItem>
            <MenuItem onClick={() => { setAnchorElUser(null); logout(); navigate('/login'); }}>
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
              <ListItemText primary="Sign Out" sx={{ color: 'error.main' }} />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
