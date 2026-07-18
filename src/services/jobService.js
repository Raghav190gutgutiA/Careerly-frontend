import api from './api.js';

export const recommendJobs = (payload) => api.post('/jobs/recommend', payload);
export const fetchSavedJobs = () => api.get('/jobs/saved');
export const toggleSaveJob = (jobId, saved) => api.patch(`/jobs/saved/${jobId}`, { saved });
export const removeSavedJob = (jobId) => api.delete(`/jobs/saved/${jobId}`);
