import { motion } from 'framer-motion';
import { FiFlag, FiCode, FiLayers, FiTarget } from 'react-icons/fi';

const Section = ({ icon: Icon, title, children }) => (
  <div>
    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
      <Icon className="h-3.5 w-3.5" /> {title}
    </div>
    {children}
  </div>
);

const Chip = ({ children }) => (
  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{children}</span>
);

const RoadmapTimeline = ({ data }) => {
  if (!data) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card ml-9 mt-1 flex max-w-2xl flex-col gap-5 p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{data.goal}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Estimated timeline: {data.estimatedTimeline}</p>
        </div>
        <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
          {data.isRoleBased ? 'Role-based' : 'Resume-tailored'}
        </span>
      </div>

      {data.monthlyMilestones?.length > 0 && (
        <Section icon={FiFlag} title="Monthly Milestones">
          <ol className="relative ml-2 flex flex-col gap-4 border-l border-slate-200 pl-4 dark:border-slate-700">
            {data.monthlyMilestones.map((m, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative"
              >
                <span className="absolute -left-[1.15rem] top-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Month {m.month}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{m.milestone}</p>
              </motion.li>
            ))}
          </ol>
        </Section>
      )}

      {data.weeklyGoals?.length > 0 && (
        <Section icon={FiTarget} title="Weekly Goals">
          <div className="flex flex-col gap-2">
            {data.weeklyGoals.map((w, i) => (
              <div key={i} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <p className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">Week {w.week}</p>
                <ul className="list-inside list-disc text-xs text-slate-600 dark:text-slate-400">
                  {w.goals.map((g, gi) => (
                    <li key={gi}>{g}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.recommendedSkills?.length > 0 && (
        <Section icon={FiLayers} title="Recommended Skills">
          <div className="flex flex-wrap gap-1.5">
            {data.recommendedSkills.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </Section>
      )}

      {data.projects?.length > 0 && (
        <Section icon={FiCode} title="Projects to Build">
          <div className="flex flex-col gap-2">
            {data.projects.map((p, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{p.title}</p>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{p.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.dsaRoadmap?.length > 0 && (
        <Section icon={FiCode} title="DSA Roadmap">
          <ul className="list-inside list-disc text-xs text-slate-600 dark:text-slate-400">
            {data.dsaRoadmap.map((d, i) => (
              <li key={i}>
                <span className="font-medium text-slate-700 dark:text-slate-300">{d.topic}</span>
                {d.resources?.length > 0 && ` — ${d.resources.join(', ')}`}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.systemDesignRoadmap?.length > 0 && (
        <Section icon={FiLayers} title="System Design Roadmap">
          <ul className="list-inside list-disc text-xs text-slate-600 dark:text-slate-400">
            {data.systemDesignRoadmap.map((s, i) => (
              <li key={i}>
                <span className="font-medium text-slate-700 dark:text-slate-300">{s.topic}</span> — {s.description}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.pdfUrl && (
        <a href={data.pdfUrl} target="_blank" rel="noreferrer" className="btn-secondary self-start !text-xs">
          Download Roadmap PDF
        </a>
      )}
    </motion.div>
  );
};

export default RoadmapTimeline;
