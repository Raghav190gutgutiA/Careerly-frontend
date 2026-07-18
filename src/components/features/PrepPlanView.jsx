import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCalendar, FiCheckSquare, FiFlag, FiChevronDown } from 'react-icons/fi';

const WeekCard = ({ week, tasks, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300"
      >
        <span>
          Week {week} <span className="font-normal text-slate-400">({tasks.length} tasks)</span>
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
            <ul className="flex flex-col gap-1.5 px-3 pb-3 text-xs text-slate-600 dark:text-slate-400">
              {tasks.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 text-brand-500">-</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Section = ({ icon: Icon, title, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      <ul className="flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-400">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-0.5 text-brand-500">-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PrepPlanView = ({ data }) => {
  if (!data) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card ml-9 mt-1 flex max-w-2xl flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Job Prep Plan: {data.targetRole}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Timeline: {data.timeline}</p>
        </div>
        <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
          {data.isRoleBased ? 'Role-based' : 'Resume-tailored'}
        </span>
      </div>

      {data.weeklyPlan?.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <FiCalendar className="h-3.5 w-3.5" /> Weekly Plan
          </div>
          <div className="flex flex-col gap-2">
            {data.weeklyPlan.map((w, i) => (
              <WeekCard key={w.week} week={w.week} tasks={w.tasks} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      )}

      <Section icon={FiCheckSquare} title="Resume Checklist" items={data.resumeChecklist} />
      <Section icon={FiFlag} title="Application Milestones" items={data.applicationMilestones} />
      <Section icon={FiFlag} title="Interview Milestones" items={data.interviewMilestones} />
    </motion.div>
  );
};

export default PrepPlanView;
