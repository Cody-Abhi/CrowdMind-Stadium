import { useState, useRef, useCallback } from 'react';

interface UseEmergencyInhibitProps {
  onTrigger: () => void;
}

export function useEmergencyInhibit({ onTrigger }: UseEmergencyInhibitProps) {
  const [isActivating, setIsActivating] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startActivation = useCallback(() => {
    setIsActivating(true);
    setProgress(0);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          onTrigger();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  }, [onTrigger]);

  const cancelActivation = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsActivating(false);
    setProgress(0);
  }, []);

  return {
    isActivating,
    progress,
    startActivation,
    cancelActivation
  };
}
