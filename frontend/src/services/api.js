import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(e);
  }
);

export const profileApi = {
  get: () => api.get('/profile').then(r => r.data),
  update: (data) => api.put('/profile', data).then(r => r.data),
};

export const projectsApi = {
  list: (params) => api.get('/projects', { params }).then(r => r.data),
  get: (slug) => api.get(`/projects/${slug}`).then(r => r.data),
  create: (data) => api.post('/projects', data).then(r => r.data),
  update: (id, data) => api.put(`/projects/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/projects/${id}`).then(r => r.data),
};

export const themeApi = {
  getActive: () => api.get('/theme').then(r => r.data),
  update: (id, data) => api.put(`/theme/${id}`, data).then(r => r.data),
};

export const themesApi = {
  list: () => api.get('/themes').then(r => r.data),
  activate: (id) => api.put(`/themes/${id}/activate`).then(r => r.data),
  create: (data) => api.post('/themes', data).then(r => r.data),
};

export const messagesApi = {
  send: (data) => api.post('/messages', data).then(r => r.data),
  list: () => api.get('/messages').then(r => r.data),
  markRead: (id) => api.put(`/messages/${id}/read`).then(r => r.data),
  delete: (id) => api.delete(`/messages/${id}`).then(r => r.data),
};

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }).then(r => r.data),
  verifyCode: (email, code) => api.post('/auth/verify-code', { email, code }).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
};

export const chatConfigApi = {
  getActive: () => api.get('/chat-config').then(r => r.data),
  list: () => api.get('/chat-config/all').then(r => r.data),
  update: (id, data) => api.put(`/chat-config/${id}`, data).then(r => r.data),
  activate: (id) => api.put(`/chat-config/${id}/activate`).then(r => r.data),
  create: (data) => api.post('/chat-config', data).then(r => r.data),
};

export const certificationsApi = {
  list: () => api.get('/certifications').then(r => r.data),
};

export default api;
