import { useCallback, useState } from 'react';
import { parseJdText, parseJdUrl, parseJdFile } from '../services/jdService.js';

export const useJdFileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (fn) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fn();
      return res.data.jobDescription;
    } catch (err) {
      setError(err.message || 'Could not read that job description');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    parseText: (text) => run(() => parseJdText(text)),
    parseUrl: (url) => run(() => parseJdUrl(url)),
    parseFile: (file) => run(() => parseJdFile(file))
  };
};
