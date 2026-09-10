import API from './axios';

// Auth Services
export const authService = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
  updateProfile: (profileData) => API.put('/auth/profile', profileData),
};

// Patient Services
export const patientService = {
  getAll: (params) => API.get('/patients', { params }),
  getById: (id) => API.get(`/patients/${id}`),
  create: (data) => API.post('/patients', data),
  update: (id, data) => API.put(`/patients/${id}`, data),
  delete: (id) => API.delete(`/patients/${id}`),
};

// Therapist Services
export const therapistService = {
  getAll: (params) => API.get('/therapists', { params }),
  getById: (id) => API.get(`/therapists/${id}`),
  create: (data) => API.post('/therapists', data),
  update: (id, data) => API.put(`/therapists/${id}`, data),
  delete: (id) => API.delete(`/therapists/${id}`),
};

// Appointment Services
export const appointmentService = {
  getAll: (params) => API.get('/appointments', { params }),
  getById: (id) => API.get(`/appointments/${id}`),
  create: (data) => API.post('/appointments', data),
  update: (id, data) => API.put(`/appointments/${id}`, data),
  cancel: (id) => API.delete(`/appointments/${id}`),
};

// Session Services
export const sessionService = {
  getAll: (params) => API.get('/sessions', { params }),
  create: (data) => API.post('/sessions', data),
  update: (id, data) => API.put(`/sessions/${id}`, data),
};

// Treatment Plan Services
export const treatmentPlanService = {
  getAll: (params) => API.get('/treatment-plans', { params }),
  create: (data) => API.post('/treatment-plans', data),
  update: (id, data) => API.put(`/treatment-plans/${id}`, data),
};

// Payment Services
export const paymentService = {
  getAll: (params) => API.get('/payments', { params }),
  create: (data) => API.post('/payments', data),
  update: (id, data) => API.put(`/payments/${id}`, data),
  getRevenueSummary: () => API.get('/payments/summary'),
};

// Dashboard Services
export const dashboardService = {
  getStats: () => API.get('/dashboard/statistics'),
};

// Therapy Services
export const clinicalServices = {
  getAll: (params) => API.get('/services', { params }),
  create: (data) => API.post('/services', data),
  update: (id, data) => API.put(`/services/${id}`, data),
};

// User Management Services (Admin)
export const userService = {
  getAll: (params) => API.get('/users', { params }),
  create: (data) => API.post('/users', data),
  update: (id, data) => API.put(`/users/${id}`, data),
};
