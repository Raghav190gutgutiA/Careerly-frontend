import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiBriefcase, FiExternalLink, FiBookmark, FiDollarSign } from 'react-icons/fi';
import { toggleSaveJob } from '../../services/jobService.js';
import { useToast } from '../../hooks/useToast.js';
import { useJobDescriptionGate } from '../../hooks/useJobDescriptionGate.js';

const JobCard = ({ job }) => {
  const { addToast } = useToast();
  const { refreshSavedJobs } = useJobDescriptionGate();
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!job.savedJobId || isSaving) return;
    setIsSaving(true);
    try {
      await toggleSaveJob(job.savedJobId, !saved);
      setSaved((s) => !s);
      addToast(saved ? 'Removed from saved jobs' : 'Job saved', 'success');
      // The ATS-review "pick a saved job" gate and the Saved Jobs panel both read
      // JobDescriptionContext's savedJobs list, which otherwise only loads once on mount.
      refreshSavedJobs();
    } catch (err) {
      addToast(err.message || 'Could not save this job', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card flex w-72 flex-shrink-0 flex-col gap-2.5 p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{job.jobTitle}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{job.company}</p>
        </div>
        <span className="flex-shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
          {job.matchPercentage}%
        </span>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <FiMapPin className="h-3 w-3" /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <FiBriefcase className="h-3 w-3" /> {job.employmentType}
        </span>
        {job.salaryEstimate && (
          <span className="flex items-center gap-1">
            <FiDollarSign className="h-3 w-3" /> {job.salaryEstimate}
          </span>
        )}
      </div>

      <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-300">{job.description}</p>

      <div className="flex flex-wrap gap-1">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-1 flex items-center gap-2">
        <a
          href={job.link}
          target="_blank"
          rel="noreferrer"
          className="btn-primary !py-1.5 flex-1 !text-xs"
        >
          Apply Now <FiExternalLink className="h-3 w-3" />
        </a>
        <button
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save job"
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border transition ${
            saved
              ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
              : 'border-slate-300 text-slate-500 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-400'
          }`}
        >
          <FiBookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>
    </motion.div>
  );
};

export default JobCard;
