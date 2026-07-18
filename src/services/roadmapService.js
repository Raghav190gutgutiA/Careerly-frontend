import api from './api.js';

export const generateRoadmap = (payload) => api.post('/roadmap/generate', payload);
export const fetchRoadmaps = () => api.get('/roadmap');
