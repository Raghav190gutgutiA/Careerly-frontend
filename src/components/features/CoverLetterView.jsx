import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiDownload } from 'react-icons/fi';

const CoverLetterView = ({ data }) => {
  const [copied, setCopied] = useState(false);
  if (!data) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.coverLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([data.coverLetterText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${(data.targetRole || 'role').replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card ml-9 mt-1 flex max-w-2xl flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Cover Letter{data.companyName ? ` - ${data.companyName}` : ''}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{data.targetRole} - {data.tone} tone</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleCopy} aria-label="Copy" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700/70">
            {copied ? <FiCheck className="h-4 w-4 text-emerald-500" /> : <FiCopy className="h-4 w-4" />}
          </button>
          <button onClick={handleDownload} aria-label="Download" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700/70">
            <FiDownload className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
        {data.coverLetterText}
      </div>
    </motion.div>
  );
};

export default CoverLetterView;
