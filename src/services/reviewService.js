import api from './api.js';

export const runAtsReview = (payload) => api.post('/review/ats', payload);
