import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSun, FiMoon, FiUser, FiBookmark, FiFileText, FiLogOut, FiX, FiZap } from 'react-icons/fi';
import { useChat } from '../../hooks/useChat.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../hooks/useTheme.js';
import ChatHistoryList from './ChatHistoryList.jsx';
import ResumeUploadModal from './ResumeUploadModal.jsx';
import ProfileModal from './ProfileModal.jsx';
import SavedJobsPanel from './SavedJobsPanel.jsx';

const NavButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/60"
  >
    <Icon className="h-4 w-4" />
    {label}
  </button>
);

const Sidebar = ({ isOpen, onClose }) => {
  const { startNewChat } = useChat();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [modal, setModal] = useState(null); // 'resume' | 'profile' | 'savedJobs' | null

  const content = (
    <div className="glass-panel flex h-full w-72 flex-shrink-0 flex-col rounded-2xl p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white">
            <FiZap className="h-4 w-4" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">Careerly</span>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 md:hidden dark:hover:bg-slate-700/60">
          <FiX className="h-4 w-4" />
        </button>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          startNewChat();
          onClose();
        }}
        className="btn-primary mb-3 w-full"
      >
        <FiPlus className="h-4 w-4" /> New Chat
      </motion.button>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <ChatHistoryList onSelect={onClose} />
      </div>

      <div className="mt-3 flex flex-col gap-0.5 border-t border-slate-200 pt-3 dark:border-slate-700">
        <NavButton icon={FiFileText} label="Manage Resume" onClick={() => setModal('resume')} />
        <NavButton icon={FiBookmark} label="Saved Jobs" onClick={() => setModal('savedJobs')} />
        <NavButton icon={FiUser} label="Profile" onClick={() => setModal('profile')} />
        <NavButton icon={theme === 'dark' ? FiSun : FiMoon} label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} onClick={toggleTheme} />
        <NavButton icon={FiLogOut} label={user?.isGuest ? 'End Guest Session' : 'Log Out'} onClick={logout} />
      </div>

      <AnimatePresence>
        {modal === 'resume' && <ResumeUploadModal onClose={() => setModal(null)} />}
        {modal === 'profile' && <ProfileModal onClose={() => setModal(null)} />}
        {modal === 'savedJobs' && <SavedJobsPanel onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <div className="hidden h-full md:block">{content}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full p-2"
            >
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
