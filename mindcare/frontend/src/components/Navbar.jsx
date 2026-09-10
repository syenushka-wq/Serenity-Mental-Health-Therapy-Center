import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About Us', path: '/about' },
    { title: 'Services', path: '/services' },
    { title: 'Therapists', path: '/therapists' },
    { title: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    const role = (user.role || '').toLowerCase();
    if (role === 'admin') return '/admin';
    if (role === 'therapist') return '/therapist';
    if (role === 'receptionist') return '/receptionist';
    return '/patient';
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
      {/* Top Crisis Notification Banner */}
      <Box sx={{ bgcolor: '#0F766E', color: 'white', py: 0.5, px: 2, fontSize: '0.82rem', textAlign: 'center' }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneInTalkIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              24/7 Mental Health Crisis Helpline: <strong>1926</strong> | Confidential & Toll-Free
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, opacity: 0.9 }}>
            Supporting Better Mental Wellness Through Connected Care
          </Typography>
        </Container>
      </Box>

      {/* Main Navigation Toolbar */}
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 65, md: 72 }, justifyContent: 'space-between' }}>
          {/* Logo & Brand */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <HealthAndSafetyIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: 'primary.dark',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                MindCare
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', display: 'block' }}>
                Therapy Center
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.title}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    px: 1.8,
                    '&:hover': { color: 'primary.main', bgcolor: '#F0FDFA' },
                  }}
                >
                  {link.title}
                </Button>
              ))}
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DashboardIcon />}
                  component={RouterLink}
                  to={getDashboardPath()}
                  sx={{ fontWeight: 600 }}
                >
                  Dashboard ({user?.role})
                </Button>
                <Button variant="outlined" color="inherit" onClick={logout} sx={{ borderColor: '#CBD5E1' }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="text"
                  sx={{ color: 'text.primary', fontWeight: 600 }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 600, display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Book Session
                </Button>
              </>
            )}

            {/* Mobile Menu Icon */}
            {isMobile && (
              <IconButton
                size="large"
                aria-label="menu"
                onClick={(e) => setAnchorElNav(e.currentTarget)}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer Menu */}
      <Menu
        anchorEl={anchorElNav}
        open={Boolean(anchorElNav)}
        onClose={() => setAnchorElNav(null)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {navLinks.map((link) => (
          <MenuItem
            key={link.title}
            onClick={() => {
              setAnchorElNav(null);
              navigate(link.path);
            }}
          >
            <Typography textAlign="center" fontWeight={600}>
              {link.title}
            </Typography>
          </MenuItem>
        ))}
        {!isAuthenticated && (
          <MenuItem
            onClick={() => {
              setAnchorElNav(null);
              navigate('/register');
            }}
          >
            <Typography textAlign="center" color="primary" fontWeight={700}>
              Book Session
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
