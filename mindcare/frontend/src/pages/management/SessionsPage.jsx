import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { sessionService, appointmentService, patientService, therapistService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const SessionsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  // Dialog State
  const [openRecordDialog, setOpenRecordDialog] = useState(false);
  const [viewingSession, setViewingSession] = useState(null);
  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    appointmentId: searchParams.get('appointmentId') || '',
    patientId: searchParams.get('patientId') || '',
    therapistId: user.therapistProfile?.id || '',
    sessionDate: new Date().toISOString().split('T')[0],
    sessionDuration: 50,
    sessionType: 'In-Person',
    therapyNotes: '',
    patientSummary: '',
    progressLevel: 'Progressing Well',
    homeworkAssigned: '',
    followUpRequired: false,
    followUpDate: '',
  });

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await sessionService.getAll();
      if (res.data.success) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();

    // Fetch confirmed appointments for recording session
    if (['Admin', 'Therapist'].includes(user?.role)) {
      appointmentService.getAll({ status: 'Confirmed' }).then((res) => {
        if (res.data.success) {
          setAppointments(res.data.appointments);
        }
      });
    }
  }, [user?.role]);

  // If redirected with query params to record a session
  useEffect(() => {
    if (searchParams.get('appointmentId')) {
      setFormData((prev) => ({
        ...prev,
        appointmentId: searchParams.get('appointmentId'),
        patientId: searchParams.get('patientId'),
      }));
      setOpenRecordDialog(true);
    }
  }, [searchParams]);

  const handleOpenRecord = () => {
    setDialogError('');
    setFormData({
      appointmentId: appointments[0]?.id || '',
      patientId: appointments[0]?.patientId || '',
      therapistId: user?.therapistProfile?.id || appointments[0]?.therapistId || '',
      sessionDate: new Date().toISOString().split('T')[0],
      sessionDuration: 50,
      sessionType: 'In-Person',
      therapyNotes: '',
      patientSummary: '',
      progressLevel: 'Progressing Well',
      homeworkAssigned: '',
      followUpRequired: false,
      followUpDate: '',
    });
    setOpenRecordDialog(true);
  };

  const handleAppointmentSelect = (e) => {
    const aptId = e.target.value;
    const selectedApt = appointments.find((a) => a.id === parseInt(aptId, 10));
    setFormData({
      ...formData,
      appointmentId: aptId,
      patientId: selectedApt ? selectedApt.patientId : '',
      therapistId: selectedApt ? selectedApt.therapistId : '',
      sessionType: selectedApt ? selectedApt.sessionType : 'In-Person',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogError('');
    setSubmitting(true);

    try {
      await sessionService.create(formData);
      setOpenRecordDialog(false);
      fetchSessions();
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
            Clinical Therapy Sessions & Progress Records
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Confidential psychotherapy consultation notes, homework tracking, and objective patient progress ratings.
          </Typography>
        </Box>
        {['Admin', 'Therapist'].includes(user?.role) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<NoteAltIcon />}
            onClick={handleOpenRecord}
            sx={{ fontWeight: 700 }}
          >
            Record Clinical Session Notes
          </Button>
        )}
      </Box>

      {/* Sessions Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Session Code</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date & Duration</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Clinician</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Format</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Progress Rating</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">View Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No clinical sessions found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((ses) => (
                    <TableRow key={ses.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                        {ses.sessionCode}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {ses.sessionDate}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ses.sessionDuration} Minutes
                        </Typography>
                      </TableCell>
                      <TableCell fontWeight={600}>{ses.patient?.fullName}</TableCell>
                      <TableCell>{ses.therapist?.fullName}</TableCell>
                      <TableCell>
                        <Chip label={ses.sessionType} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ses.progressLevel}
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => setViewingSession(ses)}
                        >
                          View Notes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Record Session Dialog (Therapists) */}
      <Dialog open={openRecordDialog} onClose={() => setOpenRecordDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Record Clinical Psychotherapy Session
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}

          <Box component="form" id="session-form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Select Scheduled Appointment"
                  required
                  value={formData.appointmentId}
                  onChange={handleAppointmentSelect}
                >
                  {appointments.map((apt) => (
                    <MenuItem key={apt.id} value={apt.id}>
                      {apt.appointmentCode} — {apt.patient?.fullName} with {apt.therapist?.fullName} ({apt.date} at {apt.timeSlot})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Session Date"
                  required
                  InputLabelProps={{ shrink: true }}
                  value={formData.sessionDate}
                  onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (Minutes)"
                  required
                  value={formData.sessionDuration}
                  onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Format"
                  value={formData.sessionType}
                  onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                >
                  <MenuItem value="In-Person">In-Person</MenuItem>
                  <MenuItem value="Online Video">Online Video</MenuItem>
                  <MenuItem value="Phone Call">Phone Call</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Observed Progress Level"
                  value={formData.progressLevel}
                  onChange={(e) => setFormData({ ...formData, progressLevel: e.target.value })}
                >
                  <MenuItem value="Initial Assessment">Initial Assessment</MenuItem>
                  <MenuItem value="Progressing Well">Progressing Well</MenuItem>
                  <MenuItem value="Moderate Progress">Moderate Progress</MenuItem>
                  <MenuItem value="Significant Improvement">Significant Improvement</MenuItem>
                  <MenuItem value="Goal Achieved">Goal Achieved</MenuItem>
                  <MenuItem value="Maintenance Phase">Maintenance Phase</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confidential Clinical Therapy Notes (Therapist Eyes Only)"
                  multiline
                  rows={4}
                  required
                  placeholder="Clinical observations, cognitive distortions identified, interventions applied, affect, MSE..."
                  value={formData.therapyNotes}
                  onChange={(e) => setFormData({ ...formData, therapyNotes: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Patient-Visible Takeaways & Summary"
                  multiline
                  rows={2}
                  placeholder="Encouraging summary, emotional validation, key concepts discussed..."
                  value={formData.patientSummary}
                  onChange={(e) => setFormData({ ...formData, patientSummary: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assigned Homework / Behavioral Tasks"
                  placeholder="e.g. Complete 3-column thought record, 10 min daily progressive muscle relaxation..."
                  value={formData.homeworkAssigned}
                  onChange={(e) => setFormData({ ...formData, homeworkAssigned: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.followUpRequired}
                      onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                    />
                  }
                  label="Follow-Up Consultation Required"
                />
              </Grid>

              {formData.followUpRequired && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Recommended Follow-Up Date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenRecordDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form="session-form"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 700 }}
          >
            {submitting ? 'Recording...' : 'Submit Session Record & Mark Completed'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Session Details Modal */}
      <Dialog open={Boolean(viewingSession)} onClose={() => setViewingSession(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Session Chart • {viewingSession?.sessionCode}
        </DialogTitle>
        <DialogContent dividers>
          {viewingSession && (
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {viewingSession.patient?.fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Clinician: {viewingSession.therapist?.fullName}
                  </Typography>
                </Box>
                <Chip label={viewingSession.progressLevel} color="primary" sx={{ fontWeight: 700 }} />
              </Box>

              <Typography variant="body2" color="text.secondary">
                Date: <strong>{viewingSession.sessionDate}</strong> • Duration: <strong>{viewingSession.sessionDuration} mins</strong> • Format: <strong>{viewingSession.sessionType}</strong>
              </Typography>

              {viewingSession.therapyNotes && (
                <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: 2, borderLeft: '4px solid #0D9488' }}>
                  <Typography variant="caption" fontWeight={700} color="primary.main">
                    CLINICAL THERAPY NOTES:
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 0.5 }}>
                    {viewingSession.therapyNotes}
                  </Typography>
                </Box>
              )}

              <Box sx={{ bgcolor: '#F0FDFA', p: 2, borderRadius: 2 }}>
                <Typography variant="caption" fontWeight={700} color="#0F766E">
                  PATIENT SUMMARY:
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {viewingSession.patientSummary || 'No summary entered.'}
                </Typography>
              </Box>

              {viewingSession.homeworkAssigned && (
                <Box sx={{ bgcolor: '#FFFBEB', p: 2, borderRadius: 2, borderLeft: '4px solid #F59E0B' }}>
                  <Typography variant="caption" fontWeight={700} color="#B45309">
                    HOMEWORK / BEHAVIORAL PROTOCOL:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {viewingSession.homeworkAssigned}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewingSession(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionsPage;
