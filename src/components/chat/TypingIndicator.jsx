import { motion } from 'framer-motion';

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex items-center gap-1.5 self-start rounded-2xl bg-slate-200/70 px-4 py-3 dark:bg-slate-800/70"
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse-dot"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </motion.div>
);

export default TypingIndicator;
