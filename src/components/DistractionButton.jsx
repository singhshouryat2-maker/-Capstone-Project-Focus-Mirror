import { useState, useRef } from 'react';
import './DistractionButton.css';

export default function DistractionButton({ count, onDistract, disabled }) {
  const [ripples, setRipples] = useState([]);
  const btnRef = useRef(null);

  const handleClick = (e) => {
    if (disabled) return;
    onDistract();

    // Create ripple
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
  };

  return (
    <div className="distraction-card" id="distraction-card">
      <div className="distraction-header">
        <h2 className="distraction-title">Distraction Tracker</h2>
        <p className="distraction-subtitle">Tap when you lose focus</p>
      </div>

      <button
        ref={btnRef}
        className={`distraction-btn ${disabled ? 'disabled' : ''} ${count > 0 ? 'has-count' : ''}`}
        onClick={handleClick}
        disabled={disabled}
        id="distraction-btn"
      >
        <div className="distraction-btn-inner">
          <span className="distraction-icon">⚡</span>
          <span className="distraction-label">Distracted!</span>
        </div>
        {ripples.map(r => (
          <span
            key={r.id}
            className="ripple"
            style={{ left: r.x, top: r.y }}
          />
        ))}
      </button>

      <div className="distraction-count-display">
        <div className="count-ring">
          <span className={`count-number ${count > 5 ? 'danger' : count > 2 ? 'warning' : ''}`}>
            {count}
          </span>
        </div>
        <span className="count-label">
          {count === 0 ? 'No distractions yet' : count === 1 ? '1 distraction' : `${count} distractions`}
        </span>
      </div>

      {!disabled && count > 0 && (
        <div className="distraction-tip">
          💡 {count <= 2 ? "You're doing great! Stay focused." :
              count <= 5 ? "Take a deep breath and refocus." :
              "Consider taking a short break."}
        </div>
      )}

      {disabled && (
        <div className="distraction-disabled-msg">
          Start the timer to track distractions
        </div>
      )}
    </div>
  );
}
