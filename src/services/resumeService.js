import api from './api.js';

export const uploadResumeFile = (file, chatId, onUploadProgress) => {
  const formData = new FormData();
  formData.append('resume', file);
  if (chatId) formData.append('chatId', chatId);
  return api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  });
};

export const fetchResumes = () => api.get('/resumes');
export const activateResume = (resumeId) => api.patch(`/resumes/${resumeId}/activate`);
export const deleteResume = (resumeId) => api.delete(`/resumes/${resumeId}`);
