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
  Avatar,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import { therapistService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const TherapistsPage = () => {
  const { user } = useAuth();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    hourlyRate: 75.0,
    bio: '',
    status: 'Active',
  });

  const fetchTherapists = async (searchTerm = '') => {
    try {
      setLoading(true);
      const res = await therapistService.getAll({ search: searchTerm });
      if (res.data.success) {
        setTherapists(res.data.therapists);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const handleOpenCreate = () => {
    setEditingTherapist(null);
    setDialogError('');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      specialization: 'Cognitive Behavioral Therapy (CBT)',
      qualification: 'Ph.D. in Clinical Psychology',
      experience: '5+ years clinical experience',
      hourlyRate: 80.0,
      bio: '',
      status: 'Active',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (th) => {
    setEditingTherapist(th);
    setDialogError('');
    setFormData({
      fullName: th.fullName,
      email: th.email,
      phone: th.phone,
      specialization: th.specialization,
      qualification: th.qualification,
      experience: th.experience || '',
      hourlyRate: th.hourlyRate || 75.0,
      bio: th.bio || '',
      status: th.status,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogError('');
    setSubmitting(true);

    try {
      if (editingTherapist) {
        await therapistService.update(editingTherapist.id, formData);
      } else {
        await therapistService.create(formData);
      }
      setOpenDialog(false);
      fetchTherapists();
    } catch (err) {
      setDialogError(err.response?.data?.message || err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this therapist profile?')) return;
    try {
      await therapistService.delete(id);
      fetchTherapists();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Therapist & Clinician Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage licensed mental health professionals, hourly session rates, and specialties.
          </Typography>
        </Box>
        {user?.role === 'Admin' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ fontWeight: 700 }}
          >
            Add New Therapist
          </Button>
        )}
      </Box>

      {/* Table */}
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
                  <TableCell sx={{ fontWeight: 700 }}>Therapist</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Specialization</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Qualification & Exp</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Hourly Rate</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {therapists.map((th) => (
                  <TableRow key={th.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                          {th.fullName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {th.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {th.email} • {th.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{th.therapistCode}</TableCell>
                    <TableCell>
                      <Chip label={th.specialization} size="small" sx={{ bgcolor: '#F0FDFA', color: '#0F766E', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{th.qualification}</Typography>
                      <Typography variant="caption" color="text.secondary">{th.experience}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>
                      ${parseFloat(th.hourlyRate || 75).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={th.status}
                        size="small"
                        color={th.status === 'Active' ? 'success' : 'default'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {['Admin', 'Therapist'].includes(user?.role) && (
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Edit Clinician">
                            <IconButton size="small" onClick={() => handleOpenEdit(th)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {user?.role === 'Admin' && th.status === 'Active' && (
                            <Tooltip title="Deactivate">
                              <IconButton size="small" color="error" onClick={() => handleDeactivate(th.id)}>
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add / Edit Therapist Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingTherapist ? 'Edit Therapist Profile' : 'Add New Clinical Specialist'}
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}

          <Box component="form" id="therapist-form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name & Clinical Degree"
                  placeholder="e.g. Dr. Jane Smith, Psy.D."
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Specialization"
                  required
                  placeholder="e.g. Cognitive Behavioral Therapy, Trauma & PTSD"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Clinical Qualifications"
                  required
                  placeholder="e.g. Ph.D. in Clinical Psychology, Licensed Psychologist"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Experience Level"
                  placeholder="e.g. 10 years clinical experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Hourly Consultation Rate ($)"
                  required
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                />
              </Grid>
              {editingTherapist && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="On Leave">On Leave</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Biography & Clinical Philosophy"
                  multiline
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
            form="therapist-form"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 700 }}
          >
            {submitting ? 'Saving...' : editingTherapist ? 'Update Therapist' : 'Save Therapist'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TherapistsPage;
