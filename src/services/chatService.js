import api from './api.js';

export const sendMessageRest = (payload) => api.post('/chats/message', payload);
export const fetchChats = () => api.get('/chats');
export const fetchChatMessages = (chatId) => api.get(`/chats/${chatId}/messages`);
export const deleteChatById = (chatId) => api.delete(`/chats/${chatId}`);
export const rateMessage = (messageId, liked) => api.patch(`/chats/messages/${messageId}/feedback`, { liked });
