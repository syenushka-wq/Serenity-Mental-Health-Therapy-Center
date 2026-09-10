import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Chip,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" sx={{ maxWidth: 800, mx: 'auto', mb: 8 }}>
          <Chip label="CONNECT WITH CARE" color="primary" size="small" sx={{ fontWeight: 700, mb: 1.5 }} />
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
            Contact MindCare Center
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Have questions about our therapy programs or intake process? Reach out to our care coordination team.
          </Typography>
        </Box>

        {/* 24/7 Crisis Alert Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: '#FEF2F2',
            border: '1px solid #FECACA',
            mb: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <PhoneInTalkIcon sx={{ color: '#DC2626', fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="#991B1B">
              Immediate Crisis Intervention
            </Typography>
            <Typography variant="body2" color="#B91C1C">
              If you are in immediate danger or experiencing acute suicidal ideation, please dial national helpline <strong>1926</strong>, visit your nearest emergency room, or call 911 immediately.
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={5}>
          {/* Contact Details */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                Clinic Headquarters
              </Typography>

              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LocationOnIcon sx={{ color: 'primary.main', fontSize: 24, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Clinic Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      MindCare Mental Health Center<br />
                      Suite 400, 120 Health Sciences Parkway<br />
                      City Center, CA 90210
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <PhoneIcon sx={{ color: 'primary.main', fontSize: 24, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Helpline & Appointments
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Main Clinic: +1 (800) 555-CARE (2273)<br />
                      Crisis Support: 1926 (24/7 National Hotline)
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <EmailIcon sx={{ color: 'primary.main', fontSize: 24, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Email Inquiries
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      General: info@mindcare.com<br />
                      Care Coordination: support@mindcare.com
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <AccessTimeIcon sx={{ color: 'primary.main', fontSize: 24, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Operating Hours
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monday – Friday: 8:00 AM – 7:00 PM<br />
                      Saturday: 9:00 AM – 4:00 PM<br />
                      Sunday: Closed (Crisis On-Call Only)
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                Send Us a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Our care coordinator will respond within 1 business day.
              </Typography>

              {submitted && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you! Your inquiry has been transmitted securely. Our team will contact you shortly.
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Message or Inquiry"
                      multiline
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      endIcon={<SendIcon />}
                      sx={{ py: 1.2, px: 3, fontWeight: 700 }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage;
