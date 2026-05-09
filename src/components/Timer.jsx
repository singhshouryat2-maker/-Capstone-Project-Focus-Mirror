import { useMemo, useState } from 'react';
import './Timer.css';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const PRESETS = [
  { label: '30s', value: 30, unit: 'seconds' },
  { label: '60s', value: 60, unit: 'seconds' },
  { label: '5m', value: 5 * 60, unit: 'seconds' },
  { label: '10m', value: 10 * 60, unit: 'seconds' },
  { label: '15m', value: 15 * 60, unit: 'seconds' },
  { label: '25m', value: 25 * 60, unit: 'seconds' },
  { label: '45m', value: 45 * 60, unit: 'seconds' },
  { label: '60m', value: 60 * 60, unit: 'seconds' },
];

export default function Timer({ timer, onStart, onDistractionCount }) {
  const { timeLeft, duration, isRunning, isComplete, progress, toggle, reset, setDurationSeconds } = timer;

  const [showCustom, setShowCustom] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [customSeconds, setCustomSeconds] = useState(0);

  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const statusText = useMemo(() => {
    if (isComplete) return 'Session Complete!';
    if (isRunning) return 'Stay focused...';
    if (progress > 0) return 'Paused';
    return 'Ready to focus?';
  }, [isComplete, isRunning, progress]);

  const statusClass = isComplete ? 'complete' : isRunning ? 'running' : progress > 0 ? 'paused' : 'idle';

  const handlePresetClick = (totalSeconds) => {
    setDurationSeconds(totalSeconds);
    setShowCustom(false);
  };

  const handleCustomApply = () => {
    const totalSecs = (parseInt(customMinutes) || 0) * 60 + (parseInt(customSeconds) || 0);
    if (totalSecs > 0) {
      setDurationSeconds(totalSecs);
      setShowCustom(false);
    }
  };

  const handleCustomToggle = () => {
    if (!isRunning) {
      setShowCustom(!showCustom);
    }
  };

  return (
    <div className="timer-card" id="timer-card">
      <div className="timer-header">
        <h2 className="timer-title">Focus Timer</h2>

        {/* Preset buttons */}
        <div className="timer-presets">
          {PRESETS.map(p => (
            <button
              key={p.label}
              className={`preset-btn ${duration === p.value ? 'active' : ''}`}
              onClick={() => handlePresetClick(p.value)}
              disabled={isRunning}
              id={`preset-${p.label}`}
            >
              {p.label}
            </button>
          ))}
          <button
            className={`preset-btn custom-toggle ${showCustom ? 'active' : ''}`}
            onClick={handleCustomToggle}
            disabled={isRunning}
            id="preset-custom"
          >
            Custom
          </button>
        </div>

        {/* Custom duration panel */}
        {showCustom && !isRunning && (
          <div className="custom-duration-panel" id="custom-duration-panel">
            <span className="custom-label">Custom Duration</span>
            <div className="custom-inputs">
              <div className="custom-field">
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="custom-input"
                  id="custom-minutes-input"
                  placeholder="0"
                />
                <span className="custom-unit">min</span>
              </div>
              <span className="custom-colon">:</span>
              <div className="custom-field">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customSeconds}
                  onChange={(e) => setCustomSeconds(e.target.value)}
                  className="custom-input"
                  id="custom-seconds-input"
                  placeholder="0"
                />
                <span className="custom-unit">sec</span>
              </div>
              <button
                className="custom-apply-btn"
                onClick={handleCustomApply}
                id="custom-apply-btn"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`timer-ring-container ${statusClass}`}>
        {/* Ambient glow */}
        <div className="timer-ambient-glow" />

        <svg className="timer-ring" viewBox="0 0 300 300">
          {/* Background track */}
          <circle
            cx="150" cy="150" r="140"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="6"
          />
          {/* Progress ring */}
          <circle
            cx="150" cy="150" r="140"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="progress-ring"
            style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.4s ease' }}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c5cfc" />
              <stop offset="50%" stopColor="#9b82fd" />
              <stop offset="100%" stopColor="#00d4aa" />
            </linearGradient>
          </defs>
        </svg>

        <div className="timer-display">
          <span className={`timer-time ${isComplete ? 'complete-pulse' : ''}`}>
            {formatTime(timeLeft)}
          </span>
          <span className={`timer-status ${statusClass}`}>{statusText}</span>
        </div>

        {/* Orbiting dot when running */}
        {isRunning && (
          <div
            className="orbiting-dot"
            style={{
              transform: `rotate(${(progress / 100) * 360 - 90}deg)`,
            }}
          >
            <div className="orbit-point" />
          </div>
        )}
      </div>

      <div className="timer-controls">
        {!isComplete ? (
          <>
            <button
              className={`timer-btn ${isRunning ? 'pause' : 'start'}`}
              onClick={() => {
                if (!isRunning && progress === 0) onStart?.();
                toggle();
              }}
              id="timer-toggle-btn"
            >
              <span className="btn-icon">{isRunning ? '⏸' : '▶'}</span>
              <span>{isRunning ? 'Pause' : progress > 0 ? 'Resume' : 'Start Focus'}</span>
            </button>
            {progress > 0 && !isRunning && (
              <button className="timer-btn reset" onClick={() => reset()} id="timer-reset-btn">
                <span className="btn-icon">↺</span>
                <span>Reset</span>
              </button>
            )}
          </>
        ) : (
          <button className="timer-btn start" onClick={() => reset()} id="timer-new-session-btn">
            <span className="btn-icon">✦</span>
            <span>New Session</span>
          </button>
        )}
      </div>

      {(isRunning || isComplete) && (
        <div className="timer-stats-mini">
          <div className="mini-stat">
            <span className="mini-stat-label">Elapsed</span>
            <span className="mini-stat-value">{formatTime(duration - timeLeft)}</span>
          </div>
          <div className="mini-stat-divider" />
          <div className="mini-stat">
            <span className="mini-stat-label">Distractions</span>
            <span className="mini-stat-value distraction-count">{onDistractionCount ?? 0}</span>
          </div>
        </div>
      )}
    </div>
  );
}
