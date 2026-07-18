import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const CATEGORIES = [
  { key: 'technicalQuestions', label: 'Technical Questions' },
  { key: 'codingQuestions', label: 'Coding Questions' },
  { key: 'hrQuestions', label: 'HR Questions' },
  { key: 'behavioralQuestions', label: 'Behavioral Questions' },
  { key: 'resumeBasedQuestions', label: 'Resume-Based Questions' },
  { key: 'projectBasedQuestions', label: 'Project-Based Questions' },
  { key: 'followUpQuestions', label: 'Follow-Up Questions' },
  { key: 'companySpecificQuestions', label: 'Company-Specific Questions' }
];

const AccordionSection = ({ label, questions, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  if (!questions || questions.length === 0) return null;

  return (
    <div className="border-b border-slate-200 last:border-b-0 dark:border-slate-700">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300"
      >
        <span>
          {label} <span className="font-normal text-slate-400">({questions.length})</span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ol className="flex flex-col gap-2 pb-3 pl-1 text-xs text-slate-600 dark:text-slate-400">
              {questions.map((q, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-brand-500">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InterviewQuestionBank = ({ data }) => {
  if (!data) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card ml-9 mt-1 flex max-w-2xl flex-col gap-1 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Interview Prep: {data.targetRole}</h4>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            data.isJobSpecific
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
          }`}
        >
          {data.isJobSpecific ? 'Job-specific' : 'Generic role-based'}
        </span>
      </div>

      {CATEGORIES.map((cat, i) => (
        <AccordionSection key={cat.key} label={cat.label} questions={data[cat.key]} defaultOpen={i === 0} />
      ))}

      {data.pdfUrl && (
        <a href={data.pdfUrl} target="_blank" rel="noreferrer" className="btn-secondary mt-3 self-start !text-xs">
          Download Question Bank PDF
        </a>
      )}
    </motion.div>
  );
};

export default InterviewQuestionBank;
