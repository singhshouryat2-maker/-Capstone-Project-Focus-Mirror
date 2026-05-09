import { useMemo } from 'react';
import './Analytics.css';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export default function Analytics({ sessions }) {
  const stats = useMemo(() => {
    if (sessions.length === 0) return null;

    const totalFocusTime = sessions.reduce((s, x) => s + x.focusTime, 0);
    const totalDistractions = sessions.reduce((s, x) => s + x.distractions, 0);
    const avgScore = Math.round(sessions.reduce((s, x) => s + x.focusScore, 0) / sessions.length);
    const bestScore = Math.max(...sessions.map(s => s.focusScore));

    // Group by day for chart
    const dayMap = {};
    sessions.forEach(s => {
      const day = formatDate(s.date);
      if (!dayMap[day]) dayMap[day] = { sessions: 0, distractions: 0, totalScore: 0, totalTime: 0 };
      dayMap[day].sessions++;
      dayMap[day].distractions += s.distractions;
      dayMap[day].totalScore += s.focusScore;
      dayMap[day].totalTime += s.focusTime;
    });

    const days = Object.entries(dayMap).slice(-7).map(([day, data]) => ({
      day,
      sessions: data.sessions,
      distractions: data.distractions,
      avgScore: Math.round(data.totalScore / data.sessions),
      totalTime: data.totalTime,
    }));

    const maxSessions = Math.max(...days.map(d => d.sessions), 1);
    const maxDistractions = Math.max(...days.map(d => d.distractions), 1);

    return { totalFocusTime, totalDistractions, avgScore, bestScore, days, maxSessions, maxDistractions };
  }, [sessions]);

  if (!stats) {
    return (
      <div className="analytics-card empty" id="analytics-card">
        <div className="analytics-empty">
          <span className="empty-icon">📊</span>
          <h3>No Data Yet</h3>
          <p>Complete your first focus session to see analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-card" id="analytics-card">
      <h2 className="analytics-title">Analytics Dashboard</h2>

      {/* Summary stats */}
      <div className="analytics-summary">
        <div className="summary-stat">
          <span className="summary-value">{formatTime(stats.totalFocusTime)}</span>
          <span className="summary-label">Total Focus</span>
        </div>
        <div className="summary-stat">
          <span className="summary-value">{sessions.length}</span>
          <span className="summary-label">Sessions</span>
        </div>
        <div className="summary-stat">
          <span className="summary-value accent">{stats.avgScore}%</span>
          <span className="summary-label">Avg Score</span>
        </div>
        <div className="summary-stat">
          <span className="summary-value success">{stats.bestScore}%</span>
          <span className="summary-label">Best Score</span>
        </div>
      </div>

      {/* Sessions chart */}
      <div className="chart-section">
        <h3 className="chart-label">Sessions per Day</h3>
        <div className="bar-chart">
          {stats.days.map((d, i) => (
            <div className="bar-column" key={i}>
              <div className="bar-wrapper">
                <div
                  className="bar session-bar"
                  style={{ height: `${(d.sessions / stats.maxSessions) * 100}%` }}
                >
                  <span className="bar-tooltip">{d.sessions} sessions</span>
                </div>
              </div>
              <span className="bar-label">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Distractions chart */}
      <div className="chart-section">
        <h3 className="chart-label">Distractions per Day</h3>
        <div className="bar-chart">
          {stats.days.map((d, i) => (
            <div className="bar-column" key={i}>
              <div className="bar-wrapper">
                <div
                  className="bar distraction-bar"
                  style={{ height: `${(d.distractions / stats.maxDistractions) * 100}%` }}
                >
                  <span className="bar-tooltip">{d.distractions} distractions</span>
                </div>
              </div>
              <span className="bar-label">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score trend */}
      <div className="chart-section">
        <h3 className="chart-label">Focus Score Trend</h3>
        <div className="score-dots">
          {stats.days.map((d, i) => (
            <div className="score-dot-col" key={i}>
              <div
                className="score-dot"
                style={{
                  '--dot-bottom': `${d.avgScore}%`,
                  '--dot-color': d.avgScore >= 80 ? 'var(--accent-secondary)' : d.avgScore >= 60 ? 'var(--accent-primary)' : 'var(--accent-danger)',
                }}
              >
                <span className="dot-value">{d.avgScore}%</span>
              </div>
              <span className="bar-label">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
