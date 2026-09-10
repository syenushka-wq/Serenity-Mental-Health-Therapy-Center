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
  Avatar,
  Stack,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import { userService } from '../../api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [dialogError, setDialogError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Receptionist',
    status: 'Active',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAll();
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setDialogError('');
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'Receptionist',
      status: 'Active',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setDialogError('');
    setFormData({
      username: u.username,
      email: u.email,
      password: '',
      role: u.role,
      status: u.status,
    });
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogError('');
    setSubmitting(true);

    try {
      if (editingUser) {
        await userService.update(editingUser.id, formData);
      } else {
        await userService.create(formData);
      }
      setOpenDialog(false);
      fetchUsers();
    } catch (err) {
      setDialogError(err.response?.data?.message || err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const roleColors = {
    Admin: { bg: '#FEF3C7', color: '#B45309' },
    Therapist: { bg: '#E0F2FE', color: '#0369A1' },
    Receptionist: { bg: '#EDE9FE', color: '#6D28D9' },
    Patient: { bg: '#D1FAE5', color: '#047857' },
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            User Account & Role Access Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage system login credentials, assign administrative roles, and audit account statuses.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenCreate}
          sx={{ fontWeight: 700 }}
        >
          Create User Account
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
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>System Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Linked Profile</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Account Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => {
                  const badge = roleColors[u.role] || { bg: '#F1F5F9', color: '#475569' };
                  return (
                    <TableRow key={u.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={u.avatar} sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.85rem' }}>
                            {u.username[0].toUpperCase()}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {u.username}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={u.role}
                          size="small"
                          sx={{ bgcolor: badge.bg, color: badge.color, fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        {u.patientProfile
                          ? `${u.patientProfile.fullName} (${u.patientProfile.patientCode})`
                          : u.therapistProfile
                          ? `${u.therapistProfile.fullName} (${u.therapistProfile.therapistCode})`
                          : 'Staff / Admin'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={u.status}
                          size="small"
                          color={u.status === 'Active' ? 'success' : 'default'}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpenEdit(u)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingUser ? 'Update User Account' : 'Create New System User'}
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}

          <Box component="form" id="user-form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  required
                  disabled={Boolean(editingUser)}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={editingUser ? 'New Password (Leave blank to keep current)' : 'Password'}
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="System Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Therapist">Therapist</MenuItem>
                  <MenuItem value="Receptionist">Receptionist</MenuItem>
                  <MenuItem value="Patient">Patient</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Account Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </TextField>
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
            form="user-form"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ fontWeight: 700 }}
          >
            {submitting ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
