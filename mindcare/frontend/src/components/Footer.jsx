import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, Link, Divider, Stack } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#0F172A', color: '#94A3B8', pt: 8, pb: 4, mt: 'auto', borderTop: '1px solid #1E293B' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand & Mission */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  bgcolor: '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <HealthAndSafetyIcon />
              </Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, letterSpacing: '-0.02em' }}>
                MindCare
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.7, mb: 2 }}>
              Supporting Better Mental Wellness Through Connected Care. Providing compassionate, evidence-based psychotherapy, cognitive counseling, and emotional wellness services.
            </Typography>
            <Typography variant="caption" sx={{ color: '#0D9488', fontWeight: 600, display: 'block' }}>
              Academic Software Engineering Capstone Project
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2.5 }}>
              Quick Links
            </Typography>
            <Stack spacing={1.2}>
              <Link component={RouterLink} to="/" color="inherit" underline="hover">
                Home
              </Link>
              <Link component={RouterLink} to="/about" color="inherit" underline="hover">
                About Center
              </Link>
              <Link component={RouterLink} to="/services" color="inherit" underline="hover">
                Therapy Services
              </Link>
              <Link component={RouterLink} to="/therapists" color="inherit" underline="hover">
                Our Therapists
              </Link>
              <Link component={RouterLink} to="/contact" color="inherit" underline="hover">
                Contact & Crisis
              </Link>
            </Stack>
          </Grid>

          {/* Clinical Programs */}
          <Grid item xs={6} sm={3} md={3}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2.5 }}>
              Clinical Programs
            </Typography>
            <Stack spacing={1.2}>
              <Typography variant="body2">Cognitive Behavioral Therapy (CBT)</Typography>
              <Typography variant="body2">Anxiety & Panic Management</Typography>
              <Typography variant="body2">Couples & Family Counseling</Typography>
              <Typography variant="body2">Mindfulness & Stress Reduction</Typography>
              <Typography variant="body2">Trauma & PTSD Recovery</Typography>
            </Stack>
          </Grid>

          {/* Contact & Hours */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2.5 }}>
              Clinic Hours & Contact
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: '#0D9488', mt: 0.2 }} />
                <Typography variant="body2">
                  Mon – Fri: 8:00 AM – 7:00 PM<br />
                  Saturday: 9:00 AM – 4:00 PM<br />
                  Sunday: Emergency On-Call
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 18, color: '#0D9488' }} />
                <Typography variant="body2">+1 (800) 555-CARE (2273)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 18, color: '#0D9488' }} />
                <Typography variant="body2">support@mindcare.com</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#1E293B' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            © {new Date().getFullYear()} MindCare – Mental Health Therapy Center Management System. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            Confidential Health System • HIPAA & University Academic Compliant
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
