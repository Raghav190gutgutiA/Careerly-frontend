import { useRef } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'react-icons/fi';
import { QUICK_ACTIONS } from '../../utils/constants.js';
import { useChat } from '../../hooks/useChat.js';

const QuickActions = () => {
  const { runQuickAction } = useChat();
  const scrollRef = useRef(null);

  return (
    <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {QUICK_ACTIONS.map((action, i) => {
        const Icon = Icons[action.icon] || Icons.FiZap;
        return (
          <motion.button
            key={action.intent}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => runQuickAction(action.intent)}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-slate-300/70 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:text-brand-400"
          >
            <Icon className="h-3.5 w-3.5" />
            {action.label}
          </motion.button>
        );
      })}
    </div>
  );
};

export default QuickActions;
