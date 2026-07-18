import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiTrash2, FiMapPin } from 'react-icons/fi';
import Modal from '../common/Modal.jsx';
import { fetchSavedJobs, removeSavedJob } from '../../services/jobService.js';
import { useJobDescriptionGate } from '../../hooks/useJobDescriptionGate.js';

const SavedJobsPanel = ({ onClose }) => {
  const { refreshSavedJobs } = useJobDescriptionGate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await fetchSavedJobs();
      setJobs(res.data.jobs.filter((j) => j.saved));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (jobId) => {
    await removeSavedJob(jobId);
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
    refreshSavedJobs();
  };

  return (
    <Modal title="Saved Jobs" onClose={onClose} widthClass="max-w-lg">
      {isLoading && <p className="text-center text-xs text-slate-400">Loading...</p>}
      {!isLoading && jobs.length === 0 && (
        <p className="py-6 text-center text-xs text-slate-400">
          No saved jobs yet - use "Find Jobs" in chat and tap the bookmark icon on a job card.
        </p>
      )}
      <div className="flex flex-col gap-2">
        {jobs.map((job, i) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{job.jobTitle}</p>
              <p className="flex items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400">
                {job.company} <FiMapPin className="ml-1 h-3 w-3" /> {job.location}
              </p>
            </div>
            <a href={job.link} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700/70">
              <FiExternalLink className="h-4 w-4" />
            </a>
            <button onClick={() => handleRemove(job._id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 hover:text-rose-500 dark:hover:bg-slate-700/70">
              <FiTrash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </Modal>
  );
};

export default SavedJobsPanel;
