import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  MenuItem,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: 'Female',
    dob: '',
    address: '',
    emergencyContact: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        role: 'Patient',
      });

      navigate('/patient');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#F8FAFC', minHeight: 'calc(100vh - 140px)' }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
              Patient Registration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your secure MindCare confidential patient portal account to book appointments and track therapy.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>
              Account Information
            </Typography>
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password (min 6 characters)"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>
              Personal & Emergency Contact Details
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  name="dob"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dob}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Home Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Emergency Contact (Name, Relationship & Phone)"
                  name="emergencyContact"
                  placeholder="e.g. John Doe (Spouse) - +1 555-0199"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
                sx={{ py: 1.3, fontWeight: 700 }}
              >
                {submitting ? 'Registering Patient...' : 'Create Account & Continue to Portal'}
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already registered?{' '}
                <RouterLink to="/login" style={{ color: '#0D9488', fontWeight: 700, textDecoration: 'none' }}>
                  Sign In Here
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
