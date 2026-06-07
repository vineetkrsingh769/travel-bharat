import api from './api';

export const statesService = {
  getAll: () => api.get('/states').then(r => r.data),
  getAllAdmin: () => api.get('/states/admin').then(r => r.data),
  getBySlug: (slug) => api.get(`/states/${slug}`).then(r => r.data),
  create: (data) => api.post('/states', data).then(r => r.data),
  update: (id, data) => api.put(`/states/${id}`, data).then(r => r.data),
  updateStatus: (id, status) => api.patch(`/states/${id}/status`, { status }).then(r => r.data),
  remove: (id) => api.delete(`/states/${id}`).then(r => r.data),
};
