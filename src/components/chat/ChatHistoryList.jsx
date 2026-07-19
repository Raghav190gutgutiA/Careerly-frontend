import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiTrash2 } from 'react-icons/fi';
import { useChat } from '../../hooks/useChat.js';
import { truncate } from '../../utils/formatters.js';

const ChatHistoryList = ({ onSelect = () => {} }) => {
  const { chats, activeChatId, selectChat, removeChat } = useChat();

  if (chats.length === 0) {
    return <p className="px-2 py-4 text-center text-xs text-slate-400">No chats yet - start a conversation.</p>;
  }

  return (
    <ul className="flex flex-col gap-0.5">
      <AnimatePresence initial={false}>
        {chats.map((chat) => (
          <motion.li
            key={chat._id}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="group relative"
          >
            <button
              onClick={() => {
                selectChat(chat._id);
                onSelect();
              }}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                activeChatId === chat._id
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <FiMessageCircle className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 truncate">{truncate(chat.title, 32)}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeChat(chat._id);
              }}
              aria-label="Delete chat"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 opacity-0 transition hover:bg-slate-300/60 hover:text-rose-500 group-hover:opacity-100 dark:hover:bg-slate-700"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};

export default ChatHistoryList;
