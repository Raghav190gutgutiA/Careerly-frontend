import { motion } from 'framer-motion';
import JobCard from './JobCard.jsx';

const JobRecommendationList = ({ jobs }) => {
  if (!jobs || jobs.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="ml-9 mt-1 flex max-w-full gap-3 overflow-x-auto pb-2"
    >
      {jobs.map((job, i) => (
        <motion.div key={`${job.link}-${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <JobCard job={job} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default JobRecommendationList;
