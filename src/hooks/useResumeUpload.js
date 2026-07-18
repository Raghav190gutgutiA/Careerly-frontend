import { useCallback, useEffect, useState } from 'react';
import { uploadResumeFile } from '../services/resumeService.js';
import { useSocket } from './useSocket.js';

// Combines the multipart upload's own transfer progress with the server-emitted
// extracting/embedding/done stages (over the socket) into one continuous progress bar.
export const useResumeUpload = ({ onDone } = {}) => {
  const { socket } = useSocket();
  const [status, setStatus] = useState('idle'); // idle | uploading | extracting | embedding | done | error
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!socket) return undefined;
    const onProgress = (progress) => {
      setStatus(progress.stage);
      setPercent(progress.percent);
    };
    socket.on('resume:progress', onProgress);
    return () => socket.off('resume:progress', onProgress);
  }, [socket]);

  const upload = useCallback(
    async (file, chatId) => {
      setStatus('uploading');
      setPercent(5);
      setError(null);
      try {
        const res = await uploadResumeFile(file, chatId, (evt) => {
          if (evt.total) setPercent(Math.min(15, Math.round((evt.loaded / evt.total) * 15)));
        });
        setStatus('done');
        setPercent(100);
        onDone?.(res.data);
        return res.data;
      } catch (err) {
        setStatus('error');
        setError(err.message || 'Upload failed');
        throw err;
      }
    },
    [onDone]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setPercent(0);
    setError(null);
  }, []);

  return { upload, status, percent, error, reset };
};
