import './Insights.css';

const TYPE_CONFIG = {
  success: { bg: 'rgba(0, 212, 170, 0.08)', border: 'rgba(0, 212, 170, 0.2)' },
  warning: { bg: 'rgba(255, 179, 71, 0.08)', border: 'rgba(255, 179, 71, 0.2)' },
  info: { bg: 'rgba(77, 166, 255, 0.08)', border: 'rgba(77, 166, 255, 0.2)' },
  tip: { bg: 'rgba(124, 92, 252, 0.08)', border: 'rgba(124, 92, 252, 0.2)' },
};

export default function Insights({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="insights-card" id="insights-card">
      <div className="insights-header">
        <h2 className="insights-title">🧠 Smart Insights</h2>
        <span className="insights-badge">AI-Powered</span>
      </div>

      <div className="insights-list">
        {insights.map((insight, i) => {
          const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.info;
          return (
            <div
              key={i}
              className="insight-item"
              style={{
                '--insight-bg': config.bg,
                '--insight-border': config.border,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <span className="insight-icon">{insight.icon}</span>
              <p className="insight-text">{insight.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
