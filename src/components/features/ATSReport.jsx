import { motion } from 'framer-motion';
import { FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';

const ScoreGauge = ({ score, label }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={radius} fill="none" strokeWidth="8" className="stroke-slate-200 dark:stroke-slate-700" />
        <motion.circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <span className="-mt-14 text-lg font-bold text-slate-900 dark:text-white">{score}</span>
      <span className="mt-8 text-xs text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
};

const ChipList = ({ items, tone = 'neutral' }) => {
  if (!items || items.length === 0) return <p className="text-xs text-slate-400">None</p>;
  const toneClass =
    tone === 'bad'
      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className={`rounded-full px-2.5 py-1 text-xs ${toneClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
};

const ListBlock = ({ icon: Icon, iconClass, title, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <Icon className={`h-3.5 w-3.5 ${iconClass}`} /> {title}
      </p>
      <ul className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-400">
        {items.map((item, i) => (
          <li key={i}>- {item}</li>
        ))}
      </ul>
    </div>
  );
};

const ATSReport = ({ data }) => {
  if (!data) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card ml-9 mt-1 flex max-w-2xl flex-col gap-5 p-5">
      <div className="flex items-center justify-center gap-8">
        <ScoreGauge score={data.overallScore} label="ATS Score" />
        {data.matchPercentage != null && <ScoreGauge score={data.matchPercentage} label="JD Match" />}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ListBlock icon={FiCheck} iconClass="text-emerald-500" title="Strengths" items={data.strengths} />
        <ListBlock icon={FiX} iconClass="text-rose-500" title="Weaknesses" items={data.weaknesses} />
      </div>

      {(data.missingSkills?.length > 0 || data.missingKeywords?.length > 0) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">Missing Skills</p>
            <ChipList items={data.missingSkills} tone="bad" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">Missing Keywords</p>
            <ChipList items={data.missingKeywords} tone="bad" />
          </div>
        </div>
      )}

      <ListBlock icon={FiAlertTriangle} iconClass="text-amber-500" title="Improvement Suggestions" items={data.improvementSuggestions} />
      <ListBlock icon={FiAlertTriangle} iconClass="text-amber-500" title="Formatting Issues" items={data.formattingIssues} />
      <ListBlock icon={FiAlertTriangle} iconClass="text-amber-500" title="Grammar Issues" items={data.grammarIssues} />
    </motion.div>
  );
};

export default ATSReport;
