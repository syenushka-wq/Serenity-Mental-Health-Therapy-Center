import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import TherapistsPublicPage from './pages/public/TherapistsPublicPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard';
import TherapistDashboard from './pages/dashboards/TherapistDashboard';
import ReceptionistDashboard from './pages/dashboards/ReceptionistDashboard';
import PatientDashboard from './pages/dashboards/PatientDashboard';

// Management Modules
import PatientsPage from './pages/management/PatientsPage';
import PatientProfilePage from './pages/management/PatientProfilePage';
import TherapistsPage from './pages/management/TherapistsPage';
import AppointmentsPage from './pages/management/AppointmentsPage';
import SessionsPage from './pages/management/SessionsPage';
import TreatmentPlansPage from './pages/management/TreatmentPlansPage';
import PaymentsPage from './pages/management/PaymentsPage';
import ServicesManagePage from './pages/management/ServicesManagePage';
import UsersPage from './pages/management/UsersPage';
import ReportsPage from './pages/management/ReportsPage';

import { useAuth } from './context/AuthContext';

// Helper component to redirect /dashboard to role dashboard
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const role = (user.role || '').toLowerCase();
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'therapist') return <Navigate to="/therapist" replace />;
  if (role === 'receptionist') return <Navigate to="/receptionist" replace />;
  return <Navigate to="/patient" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/therapists" element={<TherapistsPublicPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Dynamic /dashboard Redirect */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Role-Protected Dashboards & Modules */}
      <Route element={<DashboardLayout />}>
        {/* Specific Role Home Views */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/therapist" element={<TherapistDashboard />} />
        <Route path="/receptionist" element={<ReceptionistDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />

        {/* Clinical Operations Modules */}
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/:id" element={<PatientProfilePage />} />
        <Route path="/management/therapists" element={<TherapistsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/treatment-plans" element={<TreatmentPlansPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/management/services" element={<ServicesManagePage />} />
        <Route path="/management/users" element={<UsersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
