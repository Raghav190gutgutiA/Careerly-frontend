import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiMessageCircle, FiPaperclip } from 'react-icons/fi';
import { useChat } from '../../hooks/useChat.js';
import MessageBubble from './MessageBubble.jsx';
import StreamingMessage from './StreamingMessage.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import ProgressBar from './ProgressBar.jsx';
import MessageInput from './MessageInput.jsx';
import QuickActions from './QuickActions.jsx';

// How close to the bottom (px) the user has to be for auto-scroll to keep tracking new
// content. Past this, we assume they scrolled up on purpose to read history and stop
// yanking them back down.
const STICK_TO_BOTTOM_THRESHOLD = 96;

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-400">
    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
      <FiMessageCircle className="h-10 w-10" />
    </motion.div>
    <p className="max-w-xs px-6 text-sm">
      Start a conversation, or pick a Quick Action above. No resume yet? Just tell me the role you're targeting.
    </p>
  </motion.div>
);

const ChatWindow = ({ onOpenSidebar = () => {}, onOpenResumeUpload = () => {} }) => {
  const { messages, isTyping, isStreaming, streamingText, progress, sendMessage, activeChatId } = useChat();
  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const stickToBottomRef = useRef(true);
  // Switching chats should always jump to the bottom instantly, regardless of where the
  // user had scrolled to in the previously open chat.
  const chatSwitchedRef = useRef(false);

  useEffect(() => {
    stickToBottomRef.current = true;
    chatSwitchedRef.current = true;
  }, [activeChatId]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distanceFromBottom < STICK_TO_BOTTOM_THRESHOLD;
  };

  useEffect(() => {
    if (!stickToBottomRef.current) return;
    const behavior = chatSwitchedRef.current || isStreaming ? 'auto' : 'smooth';
    chatSwitchedRef.current = false;
    bottomRef.current?.scrollIntoView({ behavior });
  }, [messages, streamingText, isTyping, progress, isStreaming]);

  const isBusy = isTyping || isStreaming || (progress && progress.stage !== 'done');

  return (
    <motion.section
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl p-2 sm:p-4"
    >
      <div className="mb-2 flex flex-shrink-0 items-center gap-2 sm:mb-3">
        <button
          onClick={onOpenSidebar}
          aria-label="Open menu"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-700/60 md:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <QuickActions />
        </div>
      </div>

      <div ref={scrollContainerRef} onScroll={handleScroll} className="min-h-0 flex-1 overflow-y-auto px-1">
        {messages.length === 0 && !isStreaming ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4 pb-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <MessageBubble key={message._id} message={message} />
              ))}
            </AnimatePresence>
            <AnimatePresence>
              {isStreaming && <StreamingMessage key="streaming" text={streamingText} />}
              {isTyping && !isStreaming && <TypingIndicator key="typing" />}
              {progress && progress.stage !== 'done' && <ProgressBar key="progress" stage={progress.stage} percent={progress.percent} />}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="mt-2 flex-shrink-0 sm:mt-3">
        <MessageInput onSend={(text) => sendMessage(text)} onAttach={onOpenResumeUpload} disabled={isBusy} />
      </div>
    </motion.section>
  );
};

export default ChatWindow;
