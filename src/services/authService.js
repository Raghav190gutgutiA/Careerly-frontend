import api from './api.js';

export const registerUser = (payload) => api.post('/auth/register', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
export const guestLogin = (payload) => api.post('/auth/guest', payload);
export const fetchMe = () => api.get('/auth/me');
