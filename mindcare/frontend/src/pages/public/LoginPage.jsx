import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Stack,
  Chip,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectAfterLogin = (role) => {
    const from = location.state?.from?.pathname;
    if (from && !from.includes('/login')) {
      navigate(from, { replace: true });
      return;
    }

    const r = (role || '').toLowerCase();
    if (r === 'admin') navigate('/admin');
    else if (r === 'therapist') navigate('/therapist');
    else if (r === 'receptionist') navigate('/receptionist');
    else navigate('/patient');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login({ usernameOrEmail, password });
      redirectAfterLogin(user?.role);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1-Click Quick Demo Login for evaluators
  const handleQuickDemo = async (roleName, demoEmail, demoPass) => {
    setUsernameOrEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setSubmitting(true);

    try {
      const user = await login({ usernameOrEmail: demoEmail, password: demoPass });
      redirectAfterLogin(user?.role);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#F8FAFC', minHeight: 'calc(100vh - 140px)' }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Grid container>
            {/* Left Brand Column */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
                color: 'white',
                p: { xs: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'primary.dark',
                    }}
                  >
                    <HealthAndSafetyIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="h5" fontWeight={800} color="white">
                    MindCare
                  </Typography>
                </Box>

                <Typography variant="h5" fontWeight={700} sx={{ mb: 2, lineHeight: 1.3 }}>
                  Clinical Therapy Portal Access
                </Typography>
                <Typography variant="body2" sx={{ color: '#CCFBF1', lineHeight: 1.7 }}>
                  Secure role-based access for Clinic Administrators, Licensed Therapists, Receptionists, and Patients.
                </Typography>
              </Box>

              {/* Demo Credentials Box */}
              <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(255, 255, 255, 0.12)', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#99F6E4', display: 'block', mb: 1 }}>
                  ACADEMIC DEMO ACCOUNTS:
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'white' }}>
                  • Admin: admin@mindcare.com<br />
                  • Therapist: therapist@mindcare.com<br />
                  • Reception: receptionist@mindcare.com<br />
                  • Patient: patient@mindcare.com
                </Typography>
              </Box>
            </Grid>

            {/* Right Login Form Column */}
            <Grid item xs={12} md={7} sx={{ p: { xs: 4, md: 5 } }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                Sign In
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter your registered credentials or select a 1-click demo role below.
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

              {/* 1-Click Fast Login Buttons for Evaluation */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  FAST 1-CLICK DEMO LOGIN:
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6} sm={3}>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.72rem', py: 0.7, borderColor: '#F59E0B', color: '#B45309', bgcolor: '#FEF3C7' }}
                      onClick={() => handleQuickDemo('Admin', 'admin@mindcare.com', 'Admin@123')}
                    >
                      Admin
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.72rem', py: 0.7, borderColor: '#0284C7', color: '#0369A1', bgcolor: '#E0F2FE' }}
                      onClick={() => handleQuickDemo('Therapist', 'therapist@mindcare.com', 'Therapist@123')}
                    >
                      Therapist
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.72rem', py: 0.7, borderColor: '#7C3AED', color: '#6D28D9', bgcolor: '#EDE9FE' }}
                      onClick={() => handleQuickDemo('Receptionist', 'receptionist@mindcare.com', 'Reception@123')}
                    >
                      Reception
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.72rem', py: 0.7, borderColor: '#059669', color: '#047857', bgcolor: '#D1FAE5' }}
                      onClick={() => handleQuickDemo('Patient', 'patient@mindcare.com', 'Patient@123')}
                    >
                      Patient
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2.5 }}>
                <Chip label="OR USE FORM" size="small" sx={{ fontSize: '0.7rem' }} />
              </Divider>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Email or Username"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <LockOpenIcon />}
                    sx={{ py: 1.2, fontWeight: 700 }}
                  >
                    {submitting ? 'Authenticating...' : 'Sign In to Portal'}
                  </Button>
                </Stack>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  New Patient?{' '}
                  <RouterLink to="/register" style={{ color: '#0D9488', fontWeight: 700, textDecoration: 'none' }}>
                    Create Patient Account
                  </RouterLink>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
