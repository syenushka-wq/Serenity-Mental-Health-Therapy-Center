import React from 'react';
import { Box, Container, Typography, Grid, Paper, Stack, Chip, Divider } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const AboutPage = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" sx={{ maxWidth: 800, mx: 'auto', mb: 8 }}>
          <Chip label="ABOUT MINDCARE" color="primary" size="small" sx={{ fontWeight: 700, mb: 1.5 }} />
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2, letterSpacing: '-0.02em' }}>
            Compassionate, Evidence-Based Mental Health Care
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ lineHeight: 1.6 }}>
            MindCare was established to bridge the gap between clinical psychological excellence and accessible, dignified emotional healthcare.
          </Typography>
        </Box>

        {/* Mission & Vision Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%', borderRadius: 3, borderLeft: '5px solid #0D9488' }}>
              <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ mb: 1.5 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                To empower individuals, couples, and adolescents to navigate life's psychological hardships through personalized, research-backed therapeutic interventions. We are committed to dismantling mental health stigma and providing a warm, confidential sanctuary for healing and self-discovery.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%', borderRadius: 3, borderLeft: '5px solid #4F46E5' }}>
              <Typography variant="h5" fontWeight={700} color="secondary.main" sx={{ mb: 1.5 }}>
                Our Clinical Philosophy
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                We believe that lasting emotional wellness requires a bio-psycho-social approach. Rather than applying generic templates, our clinicians synthesize Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), and mindfulness techniques tailored to each client's developmental stage and lived experience.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Core Pillars */}
        <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 5 }}>
          Our Clinical Pillars
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[
            {
              title: 'Strict Confidentiality & Ethics',
              desc: 'Every intake session, clinical progress note, and psychometric assessment is protected by rigorous medical ethics and HIPAA-aligned security.',
              icon: <VerifiedIcon sx={{ fontSize: 36, color: '#0D9488' }} />,
            },
            {
              title: 'Multidisciplinary Specialists',
              desc: 'Our staff consists of Licensed Clinical Psychologists, Marriage and Family Therapists, and Psychiatric Clinical Specialists collaborating on complex cases.',
              icon: <GroupsIcon sx={{ fontSize: 36, color: '#4F46E5' }} />,
            },
            {
              title: 'Measurement-Based Care',
              desc: 'We track quantifiable progress metrics throughout treatment, allowing therapist and patient to jointly celebrate achieved goals and adjust strategies.',
              icon: <PsychologyIcon sx={{ fontSize: 36, color: '#059669' }} />,
            },
            {
              title: 'Integrated Telehealth & Clinic Care',
              desc: 'Access hybrid therapy: seamlessly transition between in-person clinic visits and secure HD video sessions based on your personal schedule.',
              icon: <LocalHospitalIcon sx={{ fontSize: 36, color: '#D97706' }} />,
            },
          ].map((pillar, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: 3, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{pillar.icon}</Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                  {pillar.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {pillar.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutPage;
