import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiFileText, FiZap, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import Modal from '../common/Modal.jsx';
import { useJobDescriptionGate } from '../../hooks/useJobDescriptionGate.js';
import JobDescriptionProvideForm from './JobDescriptionProvideForm.jsx';
import JobDescriptionSkipForm from './JobDescriptionSkipForm.jsx';

const OptionButton = ({ icon: Icon, title, description, onClick }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex w-full items-start gap-3 rounded-xl border border-slate-200 p-3.5 text-left transition hover:border-brand-400 dark:border-slate-700 dark:hover:border-brand-500"
  >
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  </motion.button>
);

// The "never dead-end the user" gate for role-fallback Quick Actions: pick a saved job, provide
// a JD (paste/upload/URL), or skip with just a target role - "skip" is always available and
// always enough context for the feature to run (see backend ROLE_FALLBACK_INTENTS).
const JobDescriptionGateModal = () => {
  const { gateRequest, savedJobs, resolveGate, cancelGate } = useJobDescriptionGate();
  const [view, setView] = useState('choose'); // choose | provide | skip

  if (!gateRequest) return null;

  // ATS Review needs no role at all to produce a meaningful fallback (a Generic ATS Score is
  // a first-class result, not a degraded one - see backend ROLE_FALLBACK_INTENTS, which
  // deliberately excludes ats_review) - so its third option runs immediately instead of
  // asking for a role like every other gated Quick Action.
  const isAts = gateRequest.intent === 'ats_review';

  const handleClose = () => {
    cancelGate();
    setView('choose');
  };

  const handleResolve = (context) => {
    resolveGate(context);
    setView('choose');
  };

  const title = view === 'choose' ? 'One more thing' : view === 'provide' ? 'Job Description' : 'Target Role';

  return (
    <Modal title={title} onClose={handleClose}>
      {view !== 'choose' && (
        <button
          onClick={() => setView('choose')}
          className="mb-3 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <FiArrowLeft className="h-3 w-3" /> Back
        </button>
      )}

      {view === 'choose' && (
        <div className="flex flex-col gap-2.5">
          <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
            {isAts
              ? 'Compare your resume against one of your saved jobs, or run a generic check:'
              : 'To give you results tied to a real role instead of generic advice, pick one:'}
          </p>
          {savedJobs.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your Saved Jobs</p>
              {savedJobs.slice(0, 4).map((job) => (
                <OptionButton
                  key={job._id}
                  icon={FiBriefcase}
                  title={job.jobTitle}
                  description={job.company}
                  onClick={() => handleResolve({ jobTitle: job.jobTitle, companyName: job.company, jobDescription: job.description })}
                />
              ))}
            </div>
          )}
          <OptionButton
            icon={FiFileText}
            title="Provide a Job Description"
            description="Paste text, upload a file, or paste a job posting URL"
            onClick={() => setView('provide')}
          />
          {isAts ? (
            <OptionButton
              icon={FiCheckCircle}
              title="Run Generic ATS Score"
              description="Evaluate formatting, keywords, skills, and experience without a specific job"
              onClick={() => handleResolve({})}
            />
          ) : (
            <OptionButton
              icon={FiZap}
              title="Skip - just give me a role"
              description="Get a generic result based on a target job title"
              onClick={() => setView('skip')}
            />
          )}
        </div>
      )}

      {view === 'provide' && <JobDescriptionProvideForm onSubmit={handleResolve} />}
      {view === 'skip' && <JobDescriptionSkipForm onSubmit={handleResolve} />}
    </Modal>
  );
};

export default JobDescriptionGateModal;
