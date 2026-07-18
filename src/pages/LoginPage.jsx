import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiZap } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import { isValidEmail, isValidPassword } from '../utils/validators.js';

const TABS = [
  { id: 'login', label: 'Log In' },
  { id: 'register', label: 'Sign Up' }
];

const LoginPage = () => {
  const { login, register, continueAsGuest } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    if (tab === 'register' && !form.name.trim()) return 'Please enter your name';
    if (!isValidEmail(form.email)) return 'Please enter a valid email';
    if (!isValidPassword(form.password)) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return addToast(validationError, 'error');

    setIsSubmitting(true);
    try {
      if (tab === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate('/chat');
    } catch (err) {
      addToast(err.message || 'Something went wrong', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuest = async () => {
    setIsGuestLoading(true);
    try {
      await continueAsGuest(form.name);
      navigate('/chat');
    } catch (err) {
      addToast(err.message || 'Could not start a guest session', 'error');
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl dark:bg-brand-600/20"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-600/20"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel relative z-10 w-full max-w-md rounded-3xl p-8"
      >
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <motion.div
            initial={{ scale: 0.6, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30"
          >
            <FiZap className="h-6 w-6" />
          </motion.div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Careerly</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your AI-powered career co-pilot</p>
        </div>

        <div className="mb-6 flex rounded-xl bg-slate-200/60 p-1 dark:bg-slate-800/60">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              {tab === t.id && (
                <motion.div layoutId="active-tab" className="absolute inset-0 rounded-lg bg-white shadow dark:bg-slate-700" />
              )}
              <span className={`relative z-10 ${tab === t.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                {t.label}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={tab}
            initial={{ opacity: 0, x: tab === 'login' ? -12 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === 'login' ? 12 : -12 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >
            {tab === 'register' && (
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Full name"
                  className="input-field pl-10"
                  autoComplete="name"
                />
              </div>
            )}
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="Email address"
                className="input-field pl-10"
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={form.password}
                onChange={update('password')}
                placeholder="Password"
                className="input-field pl-10"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="btn-primary mt-1 w-full"
            >
              {isSubmitting ? 'Please wait...' : tab === 'login' ? 'Log In' : 'Create Account'}
              <FiArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.form>
        </AnimatePresence>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs uppercase tracking-wide text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <motion.button whileTap={{ scale: 0.98 }} onClick={handleGuest} disabled={isGuestLoading} className="btn-secondary w-full">
          {isGuestLoading ? 'Starting session...' : 'Continue as Guest'}
        </motion.button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Guests can use every AI feature - sign up any time to keep your history across devices.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
