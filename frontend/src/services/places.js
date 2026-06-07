import api from './api';

export const placesService = {
  getAll: (params = {}) => api.get('/places', { params }).then(r => r.data),
  getAllAdmin: () => api.get('/places/admin').then(r => r.data),
  getBySlug: (slug) => api.get(`/places/${slug}`).then(r => r.data),
  create: (data) => api.post('/places', data).then(r => r.data),
  update: (id, data) => api.put(`/places/${id}`, data).then(r => r.data),
  updateStatus: (id, status) => api.patch(`/places/${id}/status`, { status }).then(r => r.data),
  remove: (id) => api.delete(`/places/${id}`).then(r => r.data),
};
