import api from './api.js';

export const parseJdText = (text) => api.post('/jd/parse', { text });
export const parseJdUrl = (url) => api.post('/jd/parse', { url });
export const parseJdFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/jd/parse', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
