import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Button,
  Stack,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AddIcon from '@mui/icons-material/Add';
import { patientService } from '../../api';

const PatientProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await patientService.getById(id);
        if (res.data.success) {
          setPatient(res.data.patient);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Patient chart not found.</Typography>
        <Button onClick={() => navigate('/patients')} startIcon={<ArrowBackIcon />}>
          Back to Patients List
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Back button & Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/patients')}
          variant="outlined"
          size="small"
        >
          All Patients
        </Button>
        <Typography variant="caption" color="text.secondary">
          PATIENT CLINICAL CHART • {patient.patientCode}
        </Typography>
      </Box>

      {/* Top Patient Master Banner Card */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: '#FFFFFF' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm="auto">
            <Avatar
              sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: '1.8rem', fontWeight: 700 }}
            >
              {patient.fullName[0]}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h4" fontWeight={800}>
                {patient.fullName}
              </Typography>
              <Chip
                label={patient.status}
                color={patient.status === 'Active' ? 'success' : 'default'}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              ID: <strong>{patient.patientCode}</strong> • Gender: <strong>{patient.gender}</strong> • DOB: <strong>{patient.dob || 'N/A'}</strong> • Registered: <strong>{patient.registrationDate}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: <strong>{patient.phone}</strong> • Email: <strong>{patient.email}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} md="auto">
            <Button
              variant="contained"
              color="primary"
              startIcon={<EventAvailableIcon />}
              onClick={() => navigate(`/appointments?patientId=${patient.id}`)}
              sx={{ fontWeight: 700 }}
            >
              Book Session
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Navigation */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: '1px solid #E2E8F0', bgcolor: '#F8FAFC', px: 2 }}
        >
          <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label="Medical & Personal Details" />
          <Tab icon={<EventAvailableIcon fontSize="small" />} iconPosition="start" label={`Appointments (${patient.appointments?.length || 0})`} />
          <Tab icon={<PsychologyIcon fontSize="small" />} iconPosition="start" label={`Sessions & Progress (${patient.sessions?.length || 0})`} />
          <Tab icon={<AssignmentIcon fontSize="small" />} iconPosition="start" label={`Treatment Plans (${patient.treatmentPlans?.length || 0})`} />
          <Tab icon={<PaymentIcon fontSize="small" />} iconPosition="start" label={`Billing History (${patient.payments?.length || 0})`} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* TAB 0: Medical & Personal Overview */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>
                    Contact & Emergency Information
                  </Typography>
                  <Stack spacing={1.5}>
                    <Typography variant="body2">
                      <strong>Full Name:</strong> {patient.fullName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {patient.phone}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {patient.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Address:</strong> {patient.address || 'No physical address provided.'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Emergency Contact:</strong> {patient.emergencyContact || 'None listed.'}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>
                    Clinical Intake History & Allergies
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" fontWeight={700} color="text.secondary">
                        PSYCHOLOGICAL / MEDICAL PROFILE:
                      </Typography>
                      <Typography variant="body2" sx={{ bgcolor: '#F8FAFC', p: 1.5, borderRadius: 1.5, mt: 0.5 }}>
                        {patient.medicalHistory || 'No previous clinical history documented.'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" fontWeight={700} color="text.secondary">
                        ALLERGIES / MEDICAL PRECAUTIONS:
                      </Typography>
                      <Typography variant="body2" sx={{ bgcolor: '#FEF2F2', color: '#991B1B', p: 1.5, borderRadius: 1.5, mt: 0.5 }}>
                        {patient.allergies || 'None reported.'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* TAB 1: Appointments History */}
          {activeTab === 1 && (
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Therapist</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patient.appointments?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        No appointments on record for this patient.
                      </TableCell>
                    </TableRow>
                  ) : (
                    patient.appointments?.map((apt) => (
                      <TableRow key={apt.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{apt.appointmentCode}</TableCell>
                        <TableCell>
                          {apt.date} • {apt.timeSlot}
                        </TableCell>
                        <TableCell>{apt.therapist?.fullName}</TableCell>
                        <TableCell>{apt.service?.name || 'General Consultation'}</TableCell>
                        <TableCell>{apt.sessionType}</TableCell>
                        <TableCell>
                          <Chip
                            label={apt.status}
                            size="small"
                            color={apt.status === 'Confirmed' ? 'success' : apt.status === 'Completed' ? 'primary' : 'warning'}
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* TAB 2: Therapy Sessions & Clinical Progress */}
          {activeTab === 2 && (
            <Stack spacing={2.5}>
              {patient.sessions?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No clinical therapy sessions recorded yet.
                </Typography>
              ) : (
                patient.sessions?.map((ses) => (
                  <Paper key={ses.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700} color="#0F766E">
                          {ses.sessionCode} • {ses.sessionDate} ({ses.sessionDuration} mins - {ses.sessionType})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Clinician: {ses.therapist?.fullName} ({ses.therapist?.specialization})
                        </Typography>
                      </Box>
                      <Chip label={ses.progressLevel} color="primary" size="small" sx={{ fontWeight: 700 }} />
                    </Box>

                    {ses.therapyNotes && (
                      <Box sx={{ mb: 1.5, p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1.5 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                          CONFIDENTIAL CLINICAL THERAPY NOTES:
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 0.5 }}>
                          {ses.therapyNotes}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ p: 1.5, bgcolor: '#F0FDFA', borderRadius: 1.5, mb: 1.5 }}>
                      <Typography variant="caption" fontWeight={700} color="#0F766E">
                        PATIENT SUMMARY & TAKEAWAYS:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {ses.patientSummary || 'Progress recorded.'}
                      </Typography>
                    </Box>

                    {ses.homeworkAssigned && (
                      <Typography variant="caption" sx={{ bgcolor: '#FEF3C7', color: '#B45309', px: 1, py: 0.5, borderRadius: 1, fontWeight: 600 }}>
                        Homework / Behavioral Task: {ses.homeworkAssigned}
                      </Typography>
                    )}
                  </Paper>
                ))
              )}
            </Stack>
          )}

          {/* TAB 3: Treatment Plans */}
          {activeTab === 3 && (
            <Stack spacing={3}>
              {patient.treatmentPlans?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No active treatment plans on record for this patient.
                </Typography>
              ) : (
                patient.treatmentPlans?.map((plan) => (
                  <Paper key={plan.id} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {plan.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Code: {plan.planCode} • Supervised by: {plan.therapist?.fullName} • Diagnosis: {plan.diagnosis || 'Clinical Assessment'}
                        </Typography>
                      </Box>
                      <Chip label={plan.status} color="success" size="small" sx={{ fontWeight: 700 }} />
                    </Box>

                    <Box sx={{ my: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                          Milestones Accomplished
                        </Typography>
                        <Typography variant="caption" fontWeight={700} color="primary.main">
                          {plan.progressPercentage}% ({plan.completedSessions}/{plan.recommendedSessions} recommended sessions)
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={plan.progressPercentage} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>

                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      PLANNED GOALS & MILESTONES:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', bgcolor: '#F8FAFC', p: 1.5, borderRadius: 1.5, mt: 0.5 }}>
                      {plan.goals}
                    </Typography>
                  </Paper>
                ))
              )}
            </Stack>
          )}

          {/* TAB 4: Billing History */}
          {activeTab === 4 && (
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Receipt Code</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount ($)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Reference</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patient.payments?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        No payment records found for this patient.
                      </TableCell>
                    </TableRow>
                  ) : (
                    patient.payments?.map((pay) => (
                      <TableRow key={pay.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{pay.paymentCode}</TableCell>
                        <TableCell>{pay.paymentDate}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>${parseFloat(pay.amount).toFixed(2)}</TableCell>
                        <TableCell>{pay.paymentMethod}</TableCell>
                        <TableCell>{pay.referenceNumber || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={pay.paymentStatus}
                            size="small"
                            color={pay.paymentStatus === 'Paid' ? 'success' : 'warning'}
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PatientProfilePage;
