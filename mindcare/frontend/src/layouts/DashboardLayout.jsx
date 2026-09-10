import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#F8FAFC' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization if restricted
  if (allowedRoles.length > 0 && !allowedRoles.map((r) => r.toLowerCase()).includes((user.role || '').toLowerCase())) {
    // Redirect to user's appropriate home dashboard
    const role = (user.role || '').toLowerCase();
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'therapist') return <Navigate to="/therapist" replace />;
    if (role === 'receptionist') return <Navigate to="/receptionist" replace />;
    return <Navigate to="/patient" replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { md: `calc(100% - 260px)` }, minHeight: '100vh' }}>
        <DashboardHeader handleDrawerToggle={handleDrawerToggle} />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
