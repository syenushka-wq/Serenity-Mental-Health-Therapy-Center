import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Stack,
  Slider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { treatmentPlanService, patientService, therapistService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const TreatmentPlansPage = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [patients, setPatients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: '',
    therapistId: user.therapistProfile?.id || '',
    title: '',
    diagnosis: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    goals: '',
    recommendedSessions: 8,
    completedSessions: 0,
    progressPercentage: 0,
    status: 'Active',
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await treatmentPlanService.getAll();
      if (res.data.success) {
        setPlans(res.data.treatmentPlans);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();

    if (['Admin', 'Therapist'].includes(user?.role)) {
      patientService.getAll({ limit: 100 }).then((res) => {
        if (res.data?.patients) setPatients(res.data.patients);
      });
      therapistService.getAll({ status: 'Active' }).then((res) => {
        if (res.data?.therapists) setTherapists(res.data.therapists);
      });
    }
  }, [user?.role]);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setDialogError('');
    setFormData({
      patientId: patients[0]?.id || '',
      therapistId: user?.therapistProfile?.id || therapists[0]?.id || '',
      title: 'Cognitive Behavioral Therapy for Anxiety & Panic',
      diagnosis: 'Generalized Anxiety Disorder (F41.1)',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      goals: '1. Identify symptom triggers and cognitive distortions\n2. Master diaphragmatic breathing and grounding techniques\n3. Engage in graded situational exposure activities\n4. Establish independent coping maintenance routine',
      recommendedSessions: 8,
      completedSessions: 0,
      progressPercentage: 0,
      status: 'Active',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setDialogError('');
    setFormData({
      patientId: plan.patientId,
      therapistId: plan.therapistId,
      title: plan.title,
      diagnosis: plan.diagnosis || '',
      startDate: plan.startDate,
      endDate: plan.endDate || '',
      goals: plan.goals || '',
      recommendedSessions: plan.recommendedSessions,
      completedSessions: plan.completedSessions,
      progressPercentage: plan.progressPercentage,
      status: plan.status,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogError('');
    setSubmitting(true);

    try {
      if (editingPlan) {
        await treatmentPlanService.update(editingPlan.id, formData);
      } else {
        await treatmentPlanService.create(formData);
      }
      setOpenDialog(false);
      fetchPlans();
    } catch (err) {
      setDialogError(err.response?.data?.message || err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Treatment Plans & Milestone Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Formulate personalized clinical goals, track completed sessions, and monitor patient recovery percentage.
          </Typography>
        </Box>
        {['Admin', 'Therapist'].includes(user?.role) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ fontWeight: 700 }}
          >
            Create Treatment Plan
          </Button>
        )}
      </Box>

      {/* Grid of Treatment Plan Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : plans.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No treatment plans recorded on file.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} md={6} key={plan.id}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={800} color="primary.dark">
                      {plan.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Plan: <strong>{plan.planCode}</strong> • Diagnosis: <strong>{plan.diagnosis || 'Clinical Assessment'}</strong>
                    </Typography>
                  </Box>
                  <Chip
                    label={plan.status}
                    size="small"
                    color={plan.status === 'Active' ? 'success' : plan.status === 'Completed' ? 'primary' : 'default'}
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, mb: 2.5 }}>
                  <Typography variant="body2">
                    Patient: <strong>{plan.patient?.fullName}</strong> ({plan.patient?.patientCode})
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supervising Clinician: <strong>{plan.therapist?.fullName}</strong> ({plan.therapist?.specialization})
                  </Typography>
                </Box>

                {/* Progress Bar & Session Counter */}
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      RECOVERY MILESTONE PROGRESS:
                    </Typography>
                    <Typography variant="caption" fontWeight={800} color="primary.main">
                      {plan.progressPercentage}% ({plan.completedSessions}/{plan.recommendedSessions} Sessions)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={plan.progressPercentage}
                    sx={{ height: 10, borderRadius: 5, bgcolor: '#E2E8F0' }}
                  />
                </Box>

                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                  CORE THERAPEUTIC GOALS:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', bgcolor: '#F0FDFA', p: 2, borderRadius: 2, flex: 1, fontSize: '0.85rem' }}>
                  {plan.goals}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, pt: 2, borderTop: '1px solid #F1F5F9' }}>
                  <Typography variant="caption" color="text.secondary">
                    Timeline: {plan.startDate} {plan.endDate ? `to ${plan.endDate}` : ''}
                  </Typography>

                  {['Admin', 'Therapist'].includes(user?.role) && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEdit(plan)}
                    >
                      Update Milestones
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create / Edit Plan Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingPlan ? 'Update Treatment Plan & Milestones' : 'Formulate New Clinical Treatment Plan'}
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}

          <Box component="form" id="plan-form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Select Patient"
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                >
                  {patients.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.fullName} ({p.patientCode})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Supervising Clinician"
                  required
                  value={formData.therapistId}
                  onChange={(e) => setFormData({ ...formData, therapistId: e.target.value })}
                >
                  {therapists.map((th) => (
                    <MenuItem key={th.id} value={th.id}>
                      {th.fullName} ({th.specialization})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Treatment Plan Title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Clinical Diagnosis (ICD/DSM)"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  required
                  InputLabelProps={{ shrink: true }}
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Target Completion Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Recommended Total Sessions"
                  value={formData.recommendedSessions}
                  onChange={(e) => setFormData({ ...formData, recommendedSessions: parseInt(e.target.value, 10) || 0 })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Completed Sessions"
                  value={formData.completedSessions}
                  onChange={(e) => setFormData({ ...formData, completedSessions: parseInt(e.target.value, 10) || 0 })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Paused">Paused</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" fontWeight={700} sx={{ mb: 1, display: 'block' }}>
                  Progress Percentage ({formData.progressPercentage}%)
                </Typography>
                <Slider
                  value={formData.progressPercentage}
                  onChange={(e, val) => setFormData({ ...formData, progressPercentage: val })}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Goals & Therapeutic Milestones"
                  multiline
                  rows={4}
                  required
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form="plan-form"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 700 }}
          >
            {submitting ? 'Saving...' : editingPlan ? 'Update Plan' : 'Save Treatment Plan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TreatmentPlansPage;
