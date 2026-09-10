import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { therapistService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const TherapistsPublicPage = () => {
  const [therapists, setTherapists] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchTherapists = async (searchTerm = '') => {
    try {
      setLoading(true);
      const res = await therapistService.getAll({ search: searchTerm, status: 'Active' });
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTherapists(search);
  };

  const handleBookWithTherapist = (therapistId) => {
    if (isAuthenticated) {
      navigate(`/appointments?therapistId=${therapistId}`);
    } else {
      navigate(`/login?redirect=appointments&therapistId=${therapistId}`);
    }
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}>
          <Chip label="CLINICAL STAFF" color="primary" size="small" sx={{ fontWeight: 700, mb: 1.5 }} />
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
            Our Licensed Therapists & Psychologists
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ lineHeight: 1.6 }}>
            Connect with certified clinicians dedicated to supporting your mental and emotional growth.
          </Typography>

          {/* Search Box */}
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ mt: 4, maxWidth: 500, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search by name, specialization, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Button variant="contained" color="primary" type="submit" sx={{ mr: -1 }}>
                    Search
                  </Button>
                ),
              }}
            />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {therapists.map((th) => (
              <Grid item xs={12} sm={6} md={4} key={th.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        src={th.user?.avatar}
                        sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}
                      >
                        {th.fullName[0]}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.05rem' }}>
                            {th.fullName}
                          </Typography>
                          <VerifiedIcon sx={{ fontSize: 18, color: '#0D9488' }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {th.therapistCode}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={th.specialization}
                      size="small"
                      sx={{ bgcolor: '#F0FDFA', color: '#0F766E', fontWeight: 600, mb: 2, maxWidth: '100%' }}
                    />

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6, minHeight: 60 }}>
                      {th.bio || 'Dedicated to providing compassionate clinical care and emotional guidance.'}
                    </Typography>

                    <Stack spacing={1} sx={{ pt: 2, borderTop: '1px solid #F1F5F9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon sx={{ fontSize: 18, color: '#64748B' }} />
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {th.qualification}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 18, color: '#64748B' }} />
                        <Typography variant="caption" color="text.secondary">
                          {th.experience || '5+ years clinical practice'}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Hourly Rate
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                        ${parseFloat(th.hourlyRate || 75).toFixed(2)}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleBookWithTherapist(th.id)}
                      sx={{ fontWeight: 700 }}
                    >
                      Book Session
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default TherapistsPublicPage;
