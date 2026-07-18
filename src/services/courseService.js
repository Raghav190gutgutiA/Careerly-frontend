import api from './api.js';

export const recommendCourses = (payload) => api.post('/courses/recommend', payload);
export const fetchCourses = () => api.get('/courses');
