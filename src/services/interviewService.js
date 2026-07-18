import api from './api.js';

export const prepareInterview = (payload) => api.post('/interview/prepare', payload);
export const fetchInterviewPreps = () => api.get('/interview');
