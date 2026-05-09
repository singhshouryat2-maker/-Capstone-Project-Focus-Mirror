import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initialMinutes = 25) {
  const [duration, setDuration] = useState(initialMinutes * 60);
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const elapsedBeforePauseRef = useRef(0);

  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;
  const elapsed = duration - timeLeft;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const start = useCallback(() => {
    if (isComplete) return;
    setIsRunning(true);
  }, [isComplete]);

  const pause = useCallback(() => {
    setIsRunning(false);
    elapsedBeforePauseRef.current += Date.now() - (startTimeRef.current || Date.now());
  }, []);

  const reset = useCallback((newMinutes) => {
    clearInterval(intervalRef.current);
    const mins = newMinutes || initialMinutes;
    setDuration(mins * 60);
    setTimeLeft(mins * 60);
    setIsRunning(false);
    setIsComplete(false);
    elapsedBeforePauseRef.current = 0;
    startTimeRef.current = null;
  }, [initialMinutes]);

  const toggle = useCallback(() => {
    if (isRunning) pause();
    else start();
  }, [isRunning, start, pause]);

  // Set duration in seconds directly (for seconds-based and custom durations)
  const setDurationSeconds = useCallback((secs) => {
    if (!isRunning && !isComplete) {
      setDuration(secs);
      setTimeLeft(secs);
    }
  }, [isRunning, isComplete]);

  return {
    timeLeft,
    duration,
    isRunning,
    isComplete,
    progress,
    elapsed,
    start,
    pause,
    reset,
    toggle,
    setDurationSeconds,
    setDuration: (mins) => {
      if (!isRunning && !isComplete) {
        setDuration(mins * 60);
        setTimeLeft(mins * 60);
      }
    },
  };
}
