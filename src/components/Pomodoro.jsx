import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './Pomodoro.css';

const PHASES = {
  WORK: 'work',
  SHORT_BREAK: 'short_break',
  LONG_BREAK: 'long_break',
};

const PHASE_CONFIG = {
  [PHASES.WORK]: { label: 'Focus Time', icon: '🎯', color: '#7c5cfc', minutes: 25 },
  [PHASES.SHORT_BREAK]: { label: 'Short Break', icon: '☕', color: '#00d4aa', minutes: 5 },
  [PHASES.LONG_BREAK]: { label: 'Long Break', icon: '🌿', color: '#4da6ff', minutes: 15 },
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function Pomodoro() {
  const [phase, setPhase] = useState(PHASES.WORK);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PHASE_CONFIG[PHASES.WORK].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const intervalRef = useRef(null);

  const config = PHASE_CONFIG[phase];
  const duration = config.minutes * 60;
  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Determine which pomodoro dots to show (4 cycles)
  const dots = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      index: i,
      completed: i < pomodoroCount,
      active: i === pomodoroCount && phase === PHASES.WORK,
    }));
  }, [pomodoroCount, phase]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
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

  // Handle phase completion
  useEffect(() => {
    if (!isComplete) return;

    if (phase === PHASES.WORK) {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      setTotalCompleted(prev => prev + 1);

      if (newCount >= 4) {
        // After 4 pomodoros, long break
        switchPhase(PHASES.LONG_BREAK);
        setPomodoroCount(0);
      } else {
        switchPhase(PHASES.SHORT_BREAK);
      }
    } else {
      // Break is over, start work
      switchPhase(PHASES.WORK);
    }
  }, [isComplete]);

  const switchPhase = useCallback((newPhase) => {
    setPhase(newPhase);
    setTimeLeft(PHASE_CONFIG[newPhase].minutes * 60);
    setIsComplete(false);
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    if (isComplete) return;
    setIsRunning(prev => !prev);
  }, [isComplete]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setTimeLeft(duration);
    setIsRunning(false);
    setIsComplete(false);
  }, [duration]);

  const resetAll = useCallback(() => {
    clearInterval(intervalRef.current);
    setPhase(PHASES.WORK);
    setPomodoroCount(0);
    setTimeLeft(PHASE_CONFIG[PHASES.WORK].minutes * 60);
    setIsRunning(false);
    setIsComplete(false);
  }, []);

  const skipPhase = useCallback(() => {
    clearInterval(intervalRef.current);
    if (phase === PHASES.WORK) {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      if (newCount >= 4) {
        switchPhase(PHASES.LONG_BREAK);
        setPomodoroCount(0);
      } else {
        switchPhase(PHASES.SHORT_BREAK);
      }
    } else {
      switchPhase(PHASES.WORK);
    }
  }, [phase, pomodoroCount, switchPhase]);

  const statusText = useMemo(() => {
    if (isComplete) return 'Phase Complete!';
    if (isRunning) {
      return phase === PHASES.WORK ? 'Stay focused...' : 'Relax & recharge...';
    }
    if (progress > 0) return 'Paused';
    return phase === PHASES.WORK ? 'Ready to focus?' : 'Ready for a break?';
  }, [isComplete, isRunning, progress, phase]);

  const phaseClass = phase === PHASES.WORK ? 'work' : phase === PHASES.SHORT_BREAK ? 'short-break' : 'long-break';

  return (
    <div className="pomodoro-page">
      {/* Main Timer Card */}
      <div className={`pomodoro-card ${phaseClass}`} id="pomodoro-card">
        {/* Phase indicator */}
        <div className="pomo-phase-badge">
          <span className="pomo-phase-icon">{config.icon}</span>
          <span className="pomo-phase-label">{config.label}</span>
        </div>

        {/* Pomodoro dots — 4 cycles */}
        <div className="pomo-dots">
          {dots.map(d => (
            <div
              key={d.index}
              className={`pomo-dot ${d.completed ? 'completed' : ''} ${d.active ? 'active' : ''}`}
            >
              {d.completed ? '✓' : d.index + 1}
            </div>
          ))}
        </div>

        {/* Timer ring */}
        <div className={`pomo-ring-container ${isRunning ? 'running' : ''} ${isComplete ? 'complete' : ''}`}>
          <div className="pomo-ambient-glow" style={{ '--phase-color': config.color }} />

          <svg className="pomo-ring" viewBox="0 0 300 300">
            <circle
              cx="150" cy="150" r="140"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="6"
            />
            <circle
              cx="150" cy="150" r="140"
              fill="none"
              stroke={config.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="pomo-progress-ring"
              style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.4s ease' }}
            />
          </svg>

          <div className="pomo-display">
            <span className={`pomo-time ${isComplete ? 'complete-pulse' : ''}`}>{formatTime(timeLeft)}</span>
            <span className={`pomo-status ${phaseClass}`}>{statusText}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="pomo-controls">
          {!isComplete ? (
            <>
              <button
                className={`pomo-btn ${isRunning ? 'pause' : 'start'} ${phaseClass}`}
                onClick={toggle}
                id="pomo-toggle-btn"
              >
                <span className="btn-icon">{isRunning ? '⏸' : '▶'}</span>
                <span>{isRunning ? 'Pause' : progress > 0 ? 'Resume' : 'Start'}</span>
              </button>
              {progress > 0 && !isRunning && (
                <button className="pomo-btn reset" onClick={reset} id="pomo-reset-btn">
                  <span className="btn-icon">↺</span>
                  <span>Reset</span>
                </button>
              )}
              <button className="pomo-btn skip" onClick={skipPhase} id="pomo-skip-btn">
                <span className="btn-icon">⏭</span>
                <span>Skip</span>
              </button>
            </>
          ) : (
            <button
              className={`pomo-btn start ${phaseClass}`}
              onClick={() => { setIsComplete(false); }}
              id="pomo-next-btn"
            >
              <span className="btn-icon">▶</span>
              <span>Next Phase</span>
            </button>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="pomo-info-card">
        <h3 className="pomo-info-title">🍅 Pomodoro Technique</h3>
        <div className="pomo-info-steps">
          <div className={`pomo-step ${phase === PHASES.WORK ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <div className="step-content">
              <span className="step-label">Focus</span>
              <span className="step-desc">Work for 25 minutes</span>
            </div>
          </div>
          <div className={`pomo-step ${phase === PHASES.SHORT_BREAK ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <div className="step-content">
              <span className="step-label">Short Break</span>
              <span className="step-desc">Rest for 5 minutes</span>
            </div>
          </div>
          <div className="pomo-step">
            <span className="step-number">3</span>
            <div className="step-content">
              <span className="step-label">Repeat</span>
              <span className="step-desc">Complete 4 cycles</span>
            </div>
          </div>
          <div className={`pomo-step ${phase === PHASES.LONG_BREAK ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <div className="step-content">
              <span className="step-label">Long Break</span>
              <span className="step-desc">Rest for 15 minutes</span>
            </div>
          </div>
        </div>

        {/* Session stats */}
        <div className="pomo-session-stats">
          <div className="pomo-stat">
            <span className="pomo-stat-value">{totalCompleted}</span>
            <span className="pomo-stat-label">Pomodoros Done</span>
          </div>
          <div className="pomo-stat-divider" />
          <div className="pomo-stat">
            <span className="pomo-stat-value">{totalCompleted * 25}m</span>
            <span className="pomo-stat-label">Total Focus</span>
          </div>
          <div className="pomo-stat-divider" />
          <div className="pomo-stat">
            <span className="pomo-stat-value">{Math.floor(totalCompleted / 4)}</span>
            <span className="pomo-stat-label">Full Cycles</span>
          </div>
        </div>

        <button className="pomo-reset-all-btn" onClick={resetAll} id="pomo-reset-all">
          ↺ Reset All
        </button>
      </div>
    </div>
  );
}
