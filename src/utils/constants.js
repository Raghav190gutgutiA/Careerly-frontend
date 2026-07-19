const BACKEND_PORT = 5000;

// Derives the backend origin from whatever host the page was actually loaded from, rather
// than a hardcoded 'localhost'. Opening the app via http://localhost:5173 talks to
// localhost:5000; opening it via a LAN IP (e.g. a phone on the same WiFi hitting
// http://192.168.1.5:5173, started with `vite --host`) talks to that same LAN IP's :5000 -
// which is exactly the origin backend/config/cors.js allows in development. An explicit
// VITE_API_BASE_URL/VITE_SOCKET_URL (e.g. for a production deployment on a real domain)
// always takes precedence over this derivation.
//
// Deliberately always 'http:', never window.location.protocol: this dev backend only ever
// serves plain HTTP. Mirroring the page's own protocol would send an HTTPS request to an
// HTTP-only server the moment the page is loaded over https (a tunnel, or the browser
// silently upgrading a previously-HSTS'd host) - a connection failure Chrome's console
// reports as a misleading CORS error rather than the real cause.
const backendOrigin = () => `http://${window.location.hostname}:${BACKEND_PORT}`;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${backendOrigin()}/api/v1`;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || backendOrigin();

export const AUTH_TOKEN_KEY = 'careerly_token';

export const QUICK_ACTIONS = [
  { intent: 'resume_analysis', label: 'Analyze Resume', icon: 'FiFileText' },
  { intent: 'ats_review', label: 'ATS Review', icon: 'FiCheckCircle' },
  { intent: 'resume_improvement', label: 'Improve Resume', icon: 'FiEdit3' },
  { intent: 'job_recommendation', label: 'Find Jobs', icon: 'FiBriefcase' },
  { intent: 'course_recommendation', label: 'Recommend Courses', icon: 'FiBookOpen' },
  { intent: 'career_roadmap', label: 'Career Roadmap', icon: 'FiMap' },
  { intent: 'interview_prep', label: 'Interview Prep', icon: 'FiMessageSquare' },
  { intent: 'cover_letter', label: 'Cover Letter', icon: 'FiMail' },
  { intent: 'job_prep_planner', label: 'Prep Plan', icon: 'FiCalendar' }
];

// Mirrors backend/utils/jdGate.js:ROLE_FALLBACK_INTENTS - these Quick Actions trigger the
// JobDescriptionGateModal (pick a saved job / paste-upload-URL a JD / skip with just a role)
// before firing when no resume+saved-job context already exists.
export const ROLE_FALLBACK_INTENTS = new Set([
  'resume_improvement',
  'course_recommendation',
  'career_roadmap',
  'job_prep_planner',
  'interview_prep',
  'cover_letter'
]);

// These Quick Actions only make sense against an actual resume (there's no JD/role fallback
// for them, unlike ROLE_FALLBACK_INTENTS) - disabled in the UI until one is uploaded.
// resume_improvement is technically JD-fallback capable server-side, but is kept disabled
// here without a resume per product decision (UI-only restriction).
export const RESUME_REQUIRED_INTENTS = new Set(['resume_analysis', 'ats_review', 'resume_improvement']);
