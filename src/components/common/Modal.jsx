import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const Modal = ({ title, onClose, children, widthClass = 'max-w-md' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
  >
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onClick={(e) => e.stopPropagation()}
      className={`glass-panel max-h-[85vh] w-full ${widthClass} overflow-y-auto rounded-2xl p-5`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60">
          <FiX className="h-4 w-4" />
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

export default Modal;
