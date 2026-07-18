import { useState } from 'react';
import { FiArrowRight, FiGlobe } from 'react-icons/fi';
import Modal from '../common/Modal.jsx';
import { useJobDescriptionGate } from '../../hooks/useJobDescriptionGate.js';

const COMMON_LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin'];

const CoursePreferencesModal = () => {
  const { coursePreferencesRequest, resolveCoursePreferences } = useJobDescriptionGate();
  const [language, setLanguage] = useState('');

  if (!coursePreferencesRequest) return null;

  const handleClose = () => {
    resolveCoursePreferences(null);
    setLanguage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resolveCoursePreferences(language.trim() || null);
    setLanguage('');
  };

  return (
    <Modal title="Course Preferences" onClose={handleClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Any preferred language for course content? Optional - skip for the best available course
          regardless of language.
        </p>
        <div className="relative">
          <FiGlobe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            autoFocus
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="e.g. English, Hindi..."
            list="course-languages"
            className="input-field pl-10"
          />
          <datalist id="course-languages">
            {COMMON_LANGUAGES.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleClose} className="btn-secondary flex-1">
            Skip
          </button>
          <button type="submit" className="btn-primary flex-1">
            Continue <FiArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CoursePreferencesModal;
