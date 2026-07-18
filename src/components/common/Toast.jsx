import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';
import { useToast } from '../../hooks/useToast.js';

const ICONS = {
  success: <FiCheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <FiXCircle className="h-5 w-5 text-rose-500" />,
  info: <FiInfo className="h-5 w-5 text-brand-500" />
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className="glass-panel pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl px-4 py-3 shadow-lg"
          >
            {ICONS[toast.type] || ICONS.info}
            <p className="flex-1 text-sm text-slate-700 dark:text-slate-200">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Dismiss"
            >
              <FiX className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
