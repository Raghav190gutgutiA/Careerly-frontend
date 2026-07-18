import { motion } from 'framer-motion';
import CourseCard from './CourseCard.jsx';

const CourseRecommendationList = ({ courses }) => {
  if (!courses || courses.length === 0) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-9 mt-1 flex max-w-full gap-3 overflow-x-auto pb-2">
      {courses.map((course, i) => (
        <motion.div key={`${course.link}-${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <CourseCard course={course} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CourseRecommendationList;
