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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { clinicalServices } from '../../api';

const ServicesManagePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: 50,
    price: 80.0,
    category: 'Individual Therapy',
    status: 'Active',
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await clinicalServices.getAll();
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setDialogError('');
    setFormData({
      name: '',
      description: '',
      durationMinutes: 50,
      price: 80.0,
      category: 'Individual Therapy',
      status: 'Active',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (s) => {
    setEditingService(s);
    setDialogError('');
    setFormData({
      name: s.name,
      description: s.description || '',
      durationMinutes: s.durationMinutes,
      price: s.price,
      category: s.category,
      status: s.status,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogError('');
    setSubmitting(true);

    try {
      if (editingService) {
        await clinicalServices.update(editingService.id, formData);
      } else {
        await clinicalServices.create(formData);
      }
      setOpenDialog(false);
      fetchServices();
    } catch (err) {
      setDialogError(err.response?.data?.message || err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Clinical Therapy Services & Programs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage counseling offerings, standard consultation durations, and service pricing.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ fontWeight: 700 }}
        >
          Add Therapy Service
        </Button>
      </Box>

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
                  <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Service Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fee ($)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>{s.serviceCode}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {s.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={s.category} size="small" sx={{ bgcolor: '#F0FDFA', color: '#0F766E', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>{s.durationMinutes} Minutes</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>
                      ${parseFloat(s.price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={s.status}
                        size="small"
                        color={s.status === 'Active' ? 'success' : 'default'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenEdit(s)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingService ? 'Edit Therapy Service' : 'Add New Clinical Service'}
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}

          <Box component="form" id="service-form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="Individual Therapy">Individual Therapy</MenuItem>
                  <MenuItem value="Couples Therapy">Couples Therapy</MenuItem>
                  <MenuItem value="Specialized Care">Specialized Care</MenuItem>
                  <MenuItem value="Wellness & Mindfulness">Wellness & Mindfulness</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (Minutes)"
                  required
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value, 10) || 50 })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Service Price ($)"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </Grid>
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
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description & Target Symptoms"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            form="service-form"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 700 }}
          >
            {submitting ? 'Saving...' : editingService ? 'Update Service' : 'Save Service'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServicesManagePage;
