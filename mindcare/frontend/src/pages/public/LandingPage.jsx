import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Divider,
  Paper,
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SecurityIcon from '@mui/icons-material/Security';
import StarIcon from '@mui/icons-material/Star';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const LandingPage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #042F2E 0%, #0F766E 50%, #0D9488 100%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                icon={<VerifiedUserIcon sx={{ color: '#CCFBF1 !important' }} />}
                label="Licensed Mental Health & Clinical Therapy Center"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  color: '#CCFBF1',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  mb: 3,
                  backdropFilter: 'blur(8px)',
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.4rem', md: '4rem' },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  mb: 2.5,
                }}
              >
                Supporting Better Mental Wellness Through{' '}
                <Box component="span" sx={{ color: '#5EEAD4' }}>
                  Connected Care.
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#E0F2FE',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  maxWidth: 600,
                }}
              >
                Personalized, confidential, and evidence-based psychotherapy. Connect with licensed psychologists and psychiatrists for cognitive behavioral therapy, anxiety relief, and holistic emotional healing.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#FFFFFF',
                    color: '#0F766E',
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.4,
                    fontSize: '1rem',
                    '&:hover': { bgcolor: '#F0FDFA', color: '#0D9488' },
                  }}
                >
                  Book Your Consultation
                </Button>
                <Button
                  component={RouterLink}
                  to="/services"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 600,
                    px: 3,
                    py: 1.4,
                    '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255, 255, 255, 0.1)' },
                  }}
                >
                  Explore Therapy Services
                </Button>
              </Stack>
            </Grid>

            {/* Quick Hero Floating Card */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: '#FFFFFF',
                  color: '#0F172A',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#0D9488', width: 48, height: 48 }}>
                    <PsychologyIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      MindCare Care Continuum
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Comprehensive mental health assessment
                    </Typography>
                  </Box>
                </Box>

                <Stack spacing={2.5}>
                  <Box sx={{ p: 2, bgcolor: '#F0FDFA', borderRadius: 2, borderLeft: '4px solid #0D9488' }}>
                    <Typography variant="subtitle2" fontWeight={700} color="#0F766E">
                      1. Confidential Intake
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Clinical history, symptom severity screening, and personalized therapist matching.
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, borderLeft: '4px solid #6366F1' }}>
                    <Typography variant="subtitle2" fontWeight={700} color="#4338CA">
                      2. Structured Treatment Plans
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Clear behavioral milestones, weekly homework worksheets, and objective progress tracking.
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: '#FDF4FF', borderRadius: 2, borderLeft: '4px solid #C026D3' }}>
                    <Typography variant="subtitle2" fontWeight={700} color="#86198F">
                      3. Long-term Resilience
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Maintenance check-ins and relapse-prevention protocols.
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Metrics Counter Section */}
      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 10, mb: 8 }}>
        <Paper elevation={3} sx={{ borderRadius: 3, p: 4, bgcolor: '#FFFFFF' }}>
          <Grid container spacing={3} textAlign="center" divider={<Divider orientation="vertical" flexItem />}>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" fontWeight={800} color="primary.main">
                5,200+
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Therapy Sessions Delivered
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" fontWeight={800} color="primary.main">
                98.4%
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Patient Satisfaction Rate
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" fontWeight={800} color="primary.main">
                15+
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Board Certified Clinicians
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" fontWeight={800} color="primary.main">
                24/7
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Crisis Hotline & Support
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Core Services Section */}
      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Box textAlign="center" sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}>
          <Chip label="EVIDENCE-BASED CARE" size="small" color="primary" sx={{ fontWeight: 700, mb: 1.5 }} />
          <Typography variant="h3" fontWeight={800} sx={{ mb: 1.5, letterSpacing: '-0.01em' }}>
            Comprehensive Therapy Programs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Every mind is unique. Our clinical programs combine established psychotherapy methodologies with empathetic care.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              title: 'Cognitive Behavioral Therapy (CBT)',
              desc: 'Restructure unhelpful cognitive patterns and negative thought spirals through evidence-based cognitive restructuring and behavioral experiments.',
              icon: <PsychologyIcon sx={{ fontSize: 32, color: '#0D9488' }} />,
              duration: '50 Minutes',
              price: '$85.00',
            },
            {
              title: 'Anxiety & Panic Management',
              desc: 'Targeted protocols addressing generalized anxiety, social phobia, and acute panic attacks using somatic breathing and graded exposure therapy.',
              icon: <HealthAndSafetyIcon sx={{ fontSize: 32, color: '#4F46E5' }} />,
              duration: '50 Minutes',
              price: '$80.00',
            },
            {
              title: 'Couples & Family Counseling',
              desc: 'Mediate recurring relationship conflicts, enhance emotional transparency, and rebuild safety, empathy, and mutual understanding in your partnership.',
              icon: <FavoriteIcon sx={{ fontSize: 32, color: '#E11D48' }} />,
              duration: '60 Minutes',
              price: '$95.00',
            },
            {
              title: 'Mindfulness-Based Stress Reduction',
              desc: 'Overcome workplace burnout and chronic stress via guided somatic grounding, present-moment awareness, and stress mitigation rituals.',
              icon: <SecurityIcon sx={{ fontSize: 32, color: '#059669' }} />,
              duration: '45 Minutes',
              price: '$70.00',
            },
          ].map((srv, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ mb: 2 }}>{srv.icon}</Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, fontSize: '1.05rem', lineHeight: 1.3 }}>
                    {srv.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                    {srv.desc}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid #F1F5F9' }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                      {srv.duration}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                      {srv.price}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" sx={{ mt: 5 }}>
          <Button component={RouterLink} to="/services" variant="outlined" color="primary" size="large" endIcon={<ArrowForwardIcon />}>
            View All Clinical Services
          </Button>
        </Box>
      </Container>

      {/* Featured Therapists Preview */}
      <Box sx={{ bgcolor: '#F1F5F9', py: 10, mb: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}>
            <Chip label="OUR CLINICAL TEAM" size="small" color="primary" sx={{ fontWeight: 700, mb: 1.5 }} />
            <Typography variant="h3" fontWeight={800} sx={{ mb: 1.5 }}>
              Meet Our Licensed Specialists
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our compassionate clinicians hold advanced clinical doctorates and masters degrees with years of dedicated mental health experience.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                name: 'Dr. Sarah Jenkins, Ph.D.',
                title: 'Clinical Psychologist',
                specialty: 'CBT, Trauma & Anxiety Disorders',
                img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
                exp: '12 Years Clinical Experience',
              },
              {
                name: 'Dr. David Chen, Psy.D.',
                title: 'Child & Adolescent Specialist',
                specialty: 'ADHD, Youth Counseling, Family Dynamics',
                img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
                exp: '8 Years Clinical Experience',
              },
              {
                name: 'Dr. Elena Rostova, LMFT',
                title: 'Marriage & Family Therapist',
                specialty: 'Couples Therapy, Conflict Resolution',
                img: 'https://images.unsplash.com/photo-1594824813589-980b1e42fa25?w=300&auto=format&fit=crop&q=80',
                exp: '10 Years Clinical Experience',
              },
            ].map((th, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={th.img}
                    alt={th.name}
                    sx={{ width: '100%', height: 260, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700}>
                      {th.name}
                    </Typography>
                    <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mb: 1 }}>
                      {th.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      Specialty: {th.specialty}
                    </Typography>
                    <Chip label={th.exp} size="small" sx={{ bgcolor: '#F0FDFA', color: '#0F766E', fontWeight: 600 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" sx={{ mt: 5 }}>
            <Button component={RouterLink} to="/therapists" variant="contained" color="primary" size="large">
              View All Therapists & Schedule
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 24/7 Crisis Hotline CTA Banner */}
      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            bgcolor: '#FFFBEB',
            border: '2px solid #FDE68A',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
            <Avatar sx={{ bgcolor: '#F59E0B', width: 56, height: 56, color: 'white' }}>
              <PhoneInTalkIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#92400E" sx={{ mb: 0.5 }}>
                In Need of Immediate Crisis Intervention?
              </Typography>
              <Typography variant="body1" color="#B45309" sx={{ maxWidth: 650 }}>
                If you or a loved one is experiencing severe emotional distress or thoughts of self-harm, confidential help is available 24/7. Call national lifeline <strong>1926</strong> or text HOME to 741741.
              </Typography>
            </Box>
          </Box>
          <Button
            component={RouterLink}
            to="/contact"
            variant="contained"
            sx={{ bgcolor: '#D97706', color: 'white', fontWeight: 700, px: 3, py: 1.2, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#B45309' } }}
          >
            Emergency Resources
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage;
