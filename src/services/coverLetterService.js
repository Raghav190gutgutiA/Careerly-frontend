import api from './api.js';

export const generateCoverLetter = (payload) => api.post('/cover-letter/generate', payload);
