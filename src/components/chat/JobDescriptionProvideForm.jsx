import { useState } from 'react';
import { FiArrowRight, FiUpload, FiLink, FiType } from 'react-icons/fi';
import { useJdFileUpload } from '../../hooks/useJdFileUpload.js';
import { useToast } from '../../hooks/useToast.js';

const TABS = [
  { id: 'paste', label: 'Paste Text', icon: FiType },
  { id: 'upload', label: 'Upload File', icon: FiUpload },
  { id: 'url', label: 'Job URL', icon: FiLink }
];

const JobDescriptionProvideForm = ({ onSubmit }) => {
  const [tab, setTab] = useState('paste');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const { isLoading, parseText, parseUrl, parseFile } = useJdFileUpload();
  const { addToast } = useToast();

  const handleParsed = (jd) => {
    onSubmit({ jobDescription: jd.cleanedText, jobTitle: jd.jobTitle, companyName: jd.companyName });
  };

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      handleParsed(await parseText(text));
    } catch (err) {
      addToast(err.message || 'Could not read that job description', 'error');
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    try {
      handleParsed(await parseUrl(url));
    } catch (err) {
      addToast(err.message || 'Could not read that job posting', 'error');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      handleParsed(await parseFile(file));
    } catch (err) {
      addToast(err.message || 'Could not read that file', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex rounded-xl bg-slate-200/60 p-1 dark:bg-slate-800/60">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
              tab === t.id ? 'bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'paste' && (
        <form onSubmit={handlePasteSubmit} className="flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the job description here..."
            rows={6}
            className="input-field resize-none"
          />
          <button type="submit" disabled={!text.trim() || isLoading} className="btn-primary w-full">
            {isLoading ? 'Reading...' : 'Continue'} <FiArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {tab === 'upload' && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
          <FiUpload className="h-6 w-6 text-brand-500" />
          <label className="btn-secondary cursor-pointer !text-xs">
            {isLoading ? 'Reading...' : 'Choose a file'}
            <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileChange} disabled={isLoading} />
          </label>
          <p className="text-xs text-slate-400">PDF, DOCX, or TXT</p>
        </div>
      )}

      {tab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="flex flex-col gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.linkedin.com/jobs/view/..."
            className="input-field"
          />
          <button type="submit" disabled={!url.trim() || isLoading} className="btn-primary w-full">
            {isLoading ? 'Reading...' : 'Continue'} <FiArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
};

export default JobDescriptionProvideForm;
