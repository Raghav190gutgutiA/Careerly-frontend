import api from './api.js';

export const generatePlan = (payload) => api.post('/plan/generate', payload);
export const fetchPlans = () => api.get('/plan');
