import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';
import { JobDescriptionProvider } from './context/JobDescriptionContext.jsx';
import { useAuth } from './hooks/useAuth.js';
import LoginPage from './pages/LoginPage.jsx';
import ToastContainer from './components/common/Toast.jsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx';

const ChatPage = lazy(() => import('./pages/ChatPage.jsx'));

const FullScreenLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <FullScreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <FullScreenLoader />;
  if (isAuthenticated) return <Navigate to="/chat" replace />;
  return children;
};

const PageTransition = ({ children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
    {children}
  </motion.div>
);

// Plain (non-AnimatePresence) route switch: an exit-animated route transition needs
// AnimatePresence to keep the outgoing route mounted until its exit finishes, which - combined
// with the auth-driven redirects both ProtectedRoute and PublicOnlyRoute fire on the same
// render - produced a stuck blank screen (AnimatePresence's exit tracking never resolved
// while the login->chat redirect fired mid-transition). A plain fade-in per page is a fully
// reliable trade for that risk.
const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicOnlyRoute>
          <PageTransition>
            <LoginPage />
          </PageTransition>
        </PublicOnlyRoute>
      }
    />
    <Route
      path="/chat"
      element={
        <ProtectedRoute>
          <SocketProvider>
            <JobDescriptionProvider>
              <ChatProvider>
                <PageTransition>
                  <Suspense fallback={<FullScreenLoader />}>
                    <ChatPage />
                  </Suspense>
                </PageTransition>
              </ChatProvider>
            </JobDescriptionProvider>
          </SocketProvider>
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/chat" replace />} />
  </Routes>
);

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
