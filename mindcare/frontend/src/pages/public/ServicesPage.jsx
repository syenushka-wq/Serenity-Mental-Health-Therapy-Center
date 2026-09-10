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
  CircularProgress,
  Stack,
  Alert,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { clinicalServices } from '../../api';
import { useAuth } from '../../context/AuthContext';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await clinicalServices.getAll({ status: 'Active' });
        if (res.data.success) {
          setServices(res.data.services);
        }
      } catch (err) {
        setError('Unable to load therapy services. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBook = (serviceId) => {
    if (isAuthenticated) {
      navigate(`/appointments?serviceId=${serviceId}`);
    } else {
      navigate('/login?redirect=appointments');
    }
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" sx={{ maxWidth: 800, mx: 'auto', mb: 8 }}>
          <Chip label="CLINICAL OFFERINGS" color="primary" size="small" sx={{ fontWeight: 700, mb: 1.5 }} />
          <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
            Therapy Services & Programs
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ lineHeight: 1.6 }}>
            Transparent pricing, board-certified clinical therapists, and tailored therapeutic methodologies designed around your mental wellness journey.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={4}>
            {services.map((srv) => (
              <Grid item xs={12} sm={6} md={6} key={srv.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, p: 1 }}>
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip
                        label={srv.category || 'Therapy'}
                        size="small"
                        sx={{ bgcolor: '#F0FDFA', color: '#0F766E', fontWeight: 700 }}
                      />
                      <Typography variant="h5" fontWeight={800} color="primary.main">
                        ${parseFloat(srv.price).toFixed(2)}
                      </Typography>
                    </Box>

                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5, fontSize: '1.25rem' }}>
                      {srv.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                      {srv.description || 'Specialized clinical therapeutic intervention.'}
                    </Typography>

                    <Stack spacing={1} sx={{ pt: 2, borderTop: '1px solid #F1F5F9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 18, color: '#0D9488' }} />
                        <Typography variant="body2" fontWeight={600}>
                          Session Duration: {srv.durationMinutes} minutes
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: '#10B981' }} />
                        <Typography variant="body2" color="text.secondary">
                          Available in In-Person and Telehealth Video formats
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => handleBook(srv.id)}
                      sx={{ py: 1.2, fontWeight: 700 }}
                    >
                      Book This Session
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

export default ServicesPage;
