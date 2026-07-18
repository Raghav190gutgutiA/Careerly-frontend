import { motion } from 'framer-motion';

const STAGE_LABELS = {
  running: 'Working on it',
  extracting: 'Extracting resume text',
  uploading: 'Uploading',
  embedding: 'Indexing for search',
  indexing: 'Finalizing search index',
  done: 'Done'
};

const ProgressBar = ({ stage, percent }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="w-64 max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-slate-200/70 px-4 py-3 dark:bg-slate-800/70"
  >
    <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">{STAGE_LABELS[stage] || stage}...</p>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-300/70 dark:bg-slate-700">
      <motion.div
        className="h-full rounded-full bg-brand-500"
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  </motion.div>
);

export default ProgressBar;
