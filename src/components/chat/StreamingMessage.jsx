import { motion } from 'framer-motion';
import MarkdownRenderer from './MarkdownRenderer.jsx';

const StreamingMessage = ({ text }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-slate-200/70 px-4 py-3 dark:bg-slate-800/70"
  >
    <MarkdownRenderer content={text} />
    <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-slate-400 align-text-bottom dark:bg-slate-500" />
  </motion.div>
);

export default StreamingMessage;
