import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from '../components/chat/Sidebar.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import ResumeUploadModal from '../components/chat/ResumeUploadModal.jsx';
import JobDescriptionGateModal from '../components/chat/JobDescriptionGateModal.jsx';
import CoursePreferencesModal from '../components/chat/CoursePreferencesModal.jsx';

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen gap-3 bg-slate-100 p-2 dark:bg-slate-950 sm:p-3">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ChatWindow onOpenSidebar={() => setIsSidebarOpen(true)} onOpenResumeUpload={() => setIsResumeModalOpen(true)} />

      <AnimatePresence>{isResumeModalOpen && <ResumeUploadModal onClose={() => setIsResumeModalOpen(false)} />}</AnimatePresence>
      <JobDescriptionGateModal />
      <CoursePreferencesModal />
    </div>
  );
};

export default ChatPage;
