import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from '../hooks/useSocket.js';
import { useAuth } from '../hooks/useAuth.js';
import { useJobDescriptionGate } from '../hooks/useJobDescriptionGate.js';
import { fetchChats, fetchChatMessages, deleteChatById, rateMessage as rateMessageApi } from '../services/chatService.js';
import { ROLE_FALLBACK_INTENTS } from '../utils/constants.js';

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const { requestJobContext, requestCoursePreferences, savedJobs } = useJobDescriptionGate();

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [progress, setProgress] = useState(null);

  // Socket callbacks are registered once per socket instance, so they close over stale state -
  // a ref keeps them reading the current active chat without re-subscribing on every switch.
  const activeChatIdRef = useRef(null);
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  const loadChats = useCallback(async () => {
    try {
      const res = await fetchChats();
      setChats(res.data.chats);
    } catch {
      // Chat history is a sidebar convenience, never blocks the rest of the UI.
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const selectChat = useCallback(async (chatId) => {
    setActiveChatId(chatId);
    setMessages([]);
    setProgress(null);
    setIsStreaming(false);
    setStreamingText('');
    if (!chatId) return;
    try {
      const res = await fetchChatMessages(chatId);
      setMessages(res.data.messages);
    } catch {
      // noop - an empty chat is a safe fallback
    }
  }, []);

  const startNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setProgress(null);
    setIsStreaming(false);
    setStreamingText('');
  }, []);

  const removeChat = useCallback(
    async (chatId) => {
      await deleteChatById(chatId);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChatIdRef.current === chatId) startNewChat();
    },
    [startNewChat]
  );

  const likeMessage = useCallback(async (messageId, liked) => {
    setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, liked } : m)));
    try {
      await rateMessageApi(messageId, liked);
    } catch {
      // Optimistic UI - a failed feedback call isn't worth surfacing to the user.
    }
  }, []);

  useEffect(() => {
    if (!socket) return undefined;

    // A brand-new chat has no id client-side until the server creates one; the first event
    // for it adopts that id as active rather than waiting on the emit's ack.
    const adoptChat = (chatId) => {
      if (!activeChatIdRef.current) setActiveChatId(chatId);
    };
    const isForOtherChat = (chatId) => activeChatIdRef.current && chatId !== activeChatIdRef.current;

    const onMessage = ({ chatId, message }) => {
      adoptChat(chatId);
      if (isForOtherChat(chatId)) return;
      setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
      if (message.role === 'assistant') {
        setIsTyping(false);
        setIsStreaming(false);
        setStreamingText('');
        setProgress(null);
      }
      loadChats();
    };

    const onStream = ({ chatId, token }) => {
      adoptChat(chatId);
      if (isForOtherChat(chatId)) return;
      setIsTyping(false);
      setIsStreaming(true);
      setStreamingText((prev) => prev + token);
    };

    const onStreamEnd = ({ chatId }) => {
      if (isForOtherChat(chatId)) return;
      setIsStreaming(false);
    };

    const onTyping = ({ chatId }) => {
      adoptChat(chatId);
      if (isForOtherChat(chatId)) return;
      setIsTyping(true);
    };

    const onProgress = ({ chatId, stage, percent, intent }) => {
      adoptChat(chatId);
      if (isForOtherChat(chatId)) return;
      setProgress(stage === 'done' ? null : { stage, percent, intent });
    };

    const onSync = () => loadChats();
    const onError = () => {
      setIsTyping(false);
      setIsStreaming(false);
      setProgress(null);
    };

    socket.on('chat:message', onMessage);
    socket.on('chat:stream', onStream);
    socket.on('chat:streamEnd', onStreamEnd);
    socket.on('chat:typing', onTyping);
    socket.on('action:progress', onProgress);
    socket.on('chat:sync', onSync);
    socket.on('chat:error', onError);

    return () => {
      socket.off('chat:message', onMessage);
      socket.off('chat:stream', onStream);
      socket.off('chat:streamEnd', onStreamEnd);
      socket.off('chat:typing', onTyping);
      socket.off('action:progress', onProgress);
      socket.off('chat:sync', onSync);
      socket.off('chat:error', onError);
    };
  }, [socket, loadChats]);

  const sendMessage = useCallback(
    (text, extra = {}) => {
      if (!socket || !text.trim()) return;
      socket.emit('chat:message', { chatId: activeChatIdRef.current, message: text, ...extra }, (ack) => {
        if (ack?.ok && !activeChatIdRef.current) setActiveChatId(ack.chatId);
      });
    },
    [socket]
  );

  // Fires a Quick Action. Role-fallback intents (see ROLE_FALLBACK_INTENTS) that have neither
  // an active resume nor an explicit role/JD trigger the JobDescriptionGateModal first - "skip"
  // always supplies at least a role, so the feature degrades to generic instead of erroring.
  // course_recommendation additionally always asks for an optional preferred language first
  // (never blocking - skip/dismiss just proceeds without one).
  const runQuickAction = useCallback(
    async (intent, extra = {}) => {
      if (!socket) return;
      let payload = { ...extra };

      if (intent === 'course_recommendation' && !extra.preferredLanguage) {
        const preferences = await requestCoursePreferences();
        payload = { ...payload, ...preferences };
      }

      if (ROLE_FALLBACK_INTENTS.has(intent) && !user?.activeResumeId && !extra.jobDescription && !extra.jobTitle) {
        const context = await requestJobContext(intent);
        if (!context) return;
        payload = { ...payload, ...context };
      }

      // ATS Review isn't role-gated (a Generic ATS Score is always valid with zero context -
      // see ROLE_FALLBACK_INTENTS), but per spec: if the user already has saved jobs, ask them
      // to pick one (or run generic) rather than silently defaulting to generic every time.
      // Unlike the role gate above, dismissing this one still runs (as Generic) instead of
      // aborting - a bare "close" shouldn't be treated as "cancel the whole action" for the
      // one intent where doing nothing is never actually required.
      if (intent === 'ats_review' && savedJobs.length > 0 && !extra.jobDescription && !extra.jobTitle) {
        const context = await requestJobContext(intent);
        if (context) payload = { ...payload, ...context };
      }

      socket.emit('quickAction:run', { intent, chatId: activeChatIdRef.current, ...payload }, (ack) => {
        if (ack?.ok && !activeChatIdRef.current) setActiveChatId(ack.chatId);
      });
    },
    [socket, user, requestJobContext, requestCoursePreferences, savedJobs]
  );

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        messages,
        isTyping,
        isStreaming,
        streamingText,
        progress,
        selectChat,
        startNewChat,
        removeChat,
        likeMessage,
        sendMessage,
        runQuickAction,
        loadChats
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
