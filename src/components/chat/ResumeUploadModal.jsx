import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import Modal from '../common/Modal.jsx';
import { useResumeUpload } from '../../hooks/useResumeUpload.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { fetchResumes, activateResume, deleteResume } from '../../services/resumeService.js';

const ResumeUploadModal = ({ onClose }) => {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const { upload, status, percent } = useResumeUpload({
    onDone: (data) => {
      addToast('Resume uploaded and analyzed', 'success');
      setUser((u) => ({ ...u, activeResumeId: data.resume._id }));
      loadResumes();
    }
  });

  const loadResumes = async () => {
    try {
      const res = await fetchResumes();
      setResumes(res.data.resumes);
    } catch {
      /* resume list is a convenience panel */
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    upload(file).catch((err) => addToast(err.message || 'Upload failed', 'error'));
  };

  const handleActivate = async (resumeId) => {
    await activateResume(resumeId);
    setUser((u) => ({ ...u, activeResumeId: resumeId }));
    loadResumes();
  };

  const handleDelete = async (resumeId) => {
    await deleteResume(resumeId);
    if (user?.activeResumeId === resumeId) setUser((u) => ({ ...u, activeResumeId: null }));
    loadResumes();
  };

  const isBusy = status !== 'idle' && status !== 'done' && status !== 'error';

  return (
    <Modal title="Manage Resume" onClose={onClose}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition ${
          isDragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-300 dark:border-slate-700'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <FiUploadCloud className="h-8 w-8 text-brand-500" />
        <p className="text-sm text-slate-600 dark:text-slate-300">Drop your resume here or click to browse</p>
        <p className="text-xs text-slate-400">PDF or DOCX, up to 10MB</p>

        {isBusy && (
          <div className="mt-2 w-full">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div className="h-full rounded-full bg-brand-500" animate={{ width: `${percent}%` }} />
            </div>
            <p className="mt-1 text-xs capitalize text-slate-400">{status}...</p>
          </div>
        )}
      </div>

      {resumes.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your Resumes</p>
          {resumes.map((r) => (
            <div key={r._id} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2.5 dark:border-slate-700">
              <FiFileText className="h-4 w-4 flex-shrink-0 text-slate-400" />
              <span className="flex-1 truncate text-xs text-slate-600 dark:text-slate-300">{r.fileName}</span>
              {user?.activeResumeId === r._id ? (
                <FiCheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
              ) : (
                <button onClick={() => handleActivate(r._id)} className="text-xs text-brand-600 hover:underline dark:text-brand-400">
                  Set Active
                </button>
              )}
              <button onClick={() => handleDelete(r._id)} aria-label="Delete resume" className="text-slate-400 hover:text-rose-500">
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default ResumeUploadModal;
