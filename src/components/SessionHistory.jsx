import './SessionHistory.css';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getScoreColor(score) {
  if (score >= 90) return 'var(--accent-secondary)';
  if (score >= 80) return 'var(--accent-primary-light)';
  if (score >= 60) return 'var(--accent-warning)';
  return 'var(--accent-danger)';
}

export default function SessionHistory({ sessions }) {
  const sorted = [...sessions].reverse().slice(0, 20);

  if (sorted.length === 0) {
    return (
      <div className="history-card empty" id="session-history-card">
        <div className="history-empty">
          <span className="empty-icon">📋</span>
          <h3>No Sessions Yet</h3>
          <p>Your focus sessions will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-card" id="session-history-card">
      <h2 className="history-title">Session History</h2>

      <div className="history-list">
        {sorted.map((session, i) => (
          <div
            className="history-item"
            key={session.id || i}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="history-item-left">
              <div className="history-score-badge" style={{ '--score-color': getScoreColor(session.focusScore) }}>
                {session.focusScore}%
              </div>
              <div className="history-item-info">
                <span className="history-item-date">{formatDateTime(session.date)}</span>
                <span className="history-item-details">
                  {formatTime(session.focusTime)} • {session.distractions} distraction{session.distractions !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="history-item-bar">
              <div
                className="history-bar-fill"
                style={{
                  width: `${session.focusScore}%`,
                  background: getScoreColor(session.focusScore),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
