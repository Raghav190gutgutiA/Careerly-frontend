import { createContext, useCallback, useEffect, useState } from 'react';
import { fetchSavedJobs } from '../services/jobService.js';
import { useAuth } from '../hooks/useAuth.js';

export const JobDescriptionContext = createContext(null);

// Drives the "pick a saved job / provide a JD / skip with just a role" gate that fronts every
// role-fallback Quick Action - see backend/utils/jdGate.js:ROLE_FALLBACK_INTENTS for the
// matching server-side list. `gateRequest` holds the intent currently waiting on the user's
// choice; `resolveGate`/`cancelGate` are how the modal reports back.
export const JobDescriptionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [gateRequest, setGateRequest] = useState(null);
  const [coursePreferencesRequest, setCoursePreferencesRequest] = useState(null);

  const refreshSavedJobs = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetchSavedJobs();
      setSavedJobs(res.data.jobs.filter((j) => j.saved));
    } catch {
      // Saved jobs are a convenience shortcut in the gate modal, never a hard requirement.
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshSavedJobs();
  }, [refreshSavedJobs]);

  // Returns a Promise<{jobDescription?, jobTitle?, companyName?} | null> - null means the user
  // cancelled entirely (no action should run).
  const requestJobContext = useCallback((intent) => {
    return new Promise((resolve) => {
      setGateRequest({ intent, resolve });
    });
  }, []);

  const resolveGate = useCallback(
    (context) => {
      gateRequest?.resolve(context);
      setGateRequest(null);
    },
    [gateRequest]
  );

  const cancelGate = useCallback(() => {
    gateRequest?.resolve(null);
    setGateRequest(null);
  }, [gateRequest]);

  // Course recommendation-only: asks for a preferred language before running. Unlike the role
  // gate above, this is never a hard blocker - both "skip" and dismissing the modal resolve
  // with `{}` (no language preference) rather than aborting the Quick Action entirely.
  const requestCoursePreferences = useCallback(() => {
    return new Promise((resolve) => {
      setCoursePreferencesRequest({ resolve });
    });
  }, []);

  const resolveCoursePreferences = useCallback(
    (preferredLanguage) => {
      coursePreferencesRequest?.resolve(preferredLanguage ? { preferredLanguage } : {});
      setCoursePreferencesRequest(null);
    },
    [coursePreferencesRequest]
  );

  return (
    <JobDescriptionContext.Provider
      value={{
        savedJobs,
        refreshSavedJobs,
        gateRequest,
        requestJobContext,
        resolveGate,
        cancelGate,
        coursePreferencesRequest,
        requestCoursePreferences,
        resolveCoursePreferences
      }}
    >
      {children}
    </JobDescriptionContext.Provider>
  );
};
