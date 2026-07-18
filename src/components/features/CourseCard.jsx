import { motion } from 'framer-motion';
import { FiExternalLink, FiClock, FiBarChart2 } from 'react-icons/fi';

// The whole card is a link to the course (not just the button) - clicking anywhere on it
// should reach the course, matching a real "course card" affordance.
const CourseCard = ({ course }) => (
  <motion.a
    href={course.link}
    target="_blank"
    rel="noreferrer"
    whileHover={{ y: -3 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className="card flex w-64 flex-shrink-0 cursor-pointer flex-col gap-2 p-4 transition hover:border-brand-400 dark:hover:border-brand-500"
  >
    <p className="text-xs font-medium text-brand-600 dark:text-brand-400">{course.platform}</p>
    <h4 className="text-sm font-semibold leading-snug text-slate-900 dark:text-white">{course.courseName}</h4>

    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
      <span className="flex items-center gap-1">
        <FiBarChart2 className="h-3 w-3" /> {course.difficulty}
      </span>
      <span className="flex items-center gap-1">
        <FiClock className="h-3 w-3" /> {course.duration}
      </span>
    </div>

    <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-300">{course.whyRecommended}</p>

    <div className="flex flex-wrap gap-1">
      {course.skillsCovered.slice(0, 3).map((skill) => (
        <span key={skill} className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {skill}
        </span>
      ))}
    </div>

    <span className="btn-secondary pointer-events-none mt-1 !py-1.5 !text-xs">
      View Course <FiExternalLink className="h-3 w-3" />
    </span>
  </motion.a>
);

export default CourseCard;
