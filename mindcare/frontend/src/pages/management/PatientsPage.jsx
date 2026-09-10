import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  InputAdornment,
  Pagination,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import { patientService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const PatientsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Female',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: '',
    status: 'Active',
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await patientService.getAll({
        page,
        limit: 10,
        search,
        status: statusFilter,
        gender: genderFilter,
      });

      if (res.data.success) {
        setPatients(res.data.patients);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, statusFilter, genderFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPatients();
  };

  const handleOpenCreate = () => {
    setEditingPatient(null);
    setDialogError('');
    setFormData({
      fullName: '',
      dob: '',
      gender: 'Female',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
      allergies: '',
      status: 'Active',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPatient(p);
    setDialogError('');
    setFormData({
      fullName: p.fullName,
      dob: p.dob || '',
      gender: p.gender || 'Other',
      phone: p.phone,
      email: p.email,
      address: p.address || '',
      emergencyContact: p.emergencyContact || '',
      medicalHistory: p.medicalHistory || '',
      allergies: p.allergies || '',
      status: p.status,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogError('');
    setSubmitting(true);

    try {
      if (editingPatient) {
        await patientService.update(editingPatient.id, formData);
      } else {
        await patientService.create(formData);
      }
      setOpenDialog(false);
      fetchPatients();
    } catch (err) {
      setDialogError(err.response?.data?.message || err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this patient record?')) return;
    try {
      await patientService.delete(id);
      fetchPatients();
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.role === 'Patient') {
    return (
      <Box sx={{ p: 4, maxWidth: 640, mx: 'auto', textAlign: 'center', mt: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <Typography variant="h5" fontWeight={800} gutterBottom color="primary">
            Patient Registry Access
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            For privacy and clinical data security, the master directory of all registered patients is restricted to authorized clinic staff. You can view and manage your own clinical chart, treatment plans, and sessions.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(user?.patientProfile?.id ? `/patients/${user.patientProfile.id}` : '/patient')}
            sx={{ fontWeight: 700 }}
          >
            Go to My Personal Health Profile
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Patient Registry & Profiles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage comprehensive clinical records, contacts, and treatment histories.
          </Typography>
        </Box>
        {['Admin', 'Receptionist'].includes(user?.role) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenCreate}
            sx={{ fontWeight: 700 }}
          >
            Register Patient
          </Button>
        )}
      </Box>

      {/* Filters Bar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5} md={5}>
            <Box component="form" onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                placeholder="Search patient name, code, phone, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={6} sm={3} md={2.5}>
            <TextField
              fullWidth
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Discharged">Discharged</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={3} md={2.5}>
            <TextField
              fullWidth
              select
              label="Gender"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <MenuItem value="All">All Genders</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={1} md={2} sx={{ textAlign: { md: 'right' } }}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setGenderFilter('All');
                setPage(1);
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Patients Table */}
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
                  <TableCell sx={{ fontWeight: 700 }}>Patient ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone / Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Gender & Age</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Registered</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No patients found matching your search.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  patients.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                        {p.patientCode}
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {p.fullName}
                        </Typography>
                        {p.medicalHistory && (
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                            {p.medicalHistory}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{p.phone}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {p.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{p.gender}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          DOB: {p.dob || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>{p.registrationDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={p.status}
                          size="small"
                          color={p.status === 'Active' ? 'success' : 'default'}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="View Detailed Chart Profile">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => navigate(`/patients/${p.id}`)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {['Admin', 'Receptionist', 'Therapist'].includes(user?.role) && (
                            <Tooltip title="Edit Profile Details">
                              <IconButton size="small" onClick={() => handleOpenEdit(p)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {user?.role === 'Admin' && p.status === 'Active' && (
                            <Tooltip title="Deactivate Patient">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDeactivate(p.id)}
                              >
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2.5 }}>
            <Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} color="primary" />
          </Box>
        )}
      </Paper>

      {/* Add / Edit Patient Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingPatient ? 'Edit Patient Information' : 'Register New Patient to MindCare'}
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}

          <Box component="form" id="patient-form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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
                  label="Home Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Emergency Contact (Name & Phone)"
                  placeholder="e.g. John Doe (Spouse) - +1 555-0199"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Medical / Psychological History"
                  multiline
                  rows={2}
                  placeholder="Previous diagnoses, anxiety triggers, medications..."
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Allergies (if any)"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
              </Grid>
              {editingPatient && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Discharged">Discharged</MenuItem>
                  </TextField>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form="patient-form"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 700 }}
          >
            {submitting ? 'Saving...' : editingPatient ? 'Update Patient' : 'Save Patient'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientsPage;
