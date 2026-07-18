import { useContext } from 'react';
import { JobDescriptionContext } from '../context/JobDescriptionContext.jsx';

export const useJobDescriptionGate = () => useContext(JobDescriptionContext);
