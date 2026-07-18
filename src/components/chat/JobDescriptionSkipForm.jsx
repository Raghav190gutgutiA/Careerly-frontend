import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

const JobDescriptionSkipForm = ({ onSubmit }) => {
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role.trim()) return;
    onSubmit({ jobTitle: role.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        No job description handy? Just tell me the role you're targeting and I'll generate a generic, role-based result.
      </p>
      <input
        autoFocus
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="e.g. Frontend Developer, SDE-1, Data Analyst"
        className="input-field"
      />
      <button type="submit" disabled={!role.trim()} className="btn-primary w-full">
        Continue <FiArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
};

export default JobDescriptionSkipForm;
