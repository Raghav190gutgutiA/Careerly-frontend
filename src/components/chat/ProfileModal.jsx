import { FiUser, FiMail, FiCalendar } from 'react-icons/fi';
import Modal from '../common/Modal.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
    <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm text-slate-700 dark:text-slate-200">{value}</p>
    </div>
  </div>
);

const ProfileModal = ({ onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Modal title="Profile" onClose={onClose}>
      <div className="mb-4 flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-xl font-semibold text-white">
          {user.name?.[0]?.toUpperCase() || '?'}
        </div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
        {user.isGuest && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            Guest Session
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Row icon={FiUser} label="Name" value={user.name} />
        <Row icon={FiMail} label="Email" value={user.isGuest ? 'Not set (guest session)' : user.email} />
        <Row icon={FiCalendar} label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} />
      </div>

      {user.isGuest && (
        <p className="mt-4 text-center text-xs text-slate-400">
          Your chats, resumes, and saved jobs are stored for this guest session. Sign up to keep them across devices.
        </p>
      )}
    </Modal>
  );
};

export default ProfileModal;
