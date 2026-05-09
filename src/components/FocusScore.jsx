import './FocusScore.css';

export default function FocusScore({ score, isVisible }) {
  if (!isVisible) return null;

  const getGrade = (s) => {
    if (s >= 90) return { letter: 'S', label: 'Legendary Focus', color: '#00d4aa' };
    if (s >= 80) return { letter: 'A', label: 'Excellent', color: '#7c5cfc' };
    if (s >= 70) return { letter: 'B', label: 'Good Job', color: '#4da6ff' };
    if (s >= 60) return { letter: 'C', label: 'Decent', color: '#ffb347' };
    return { letter: 'D', label: 'Keep Trying', color: '#ff4d6a' };
  };

  const grade = getGrade(score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="focus-score-card" id="focus-score-card">
      <h2 className="score-title">Focus Score</h2>

      <div className="score-visual">
        <svg className="score-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={grade.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="score-progress"
            style={{ '--score-color': grade.color }}
          />
        </svg>
        <div className="score-center">
          <span className="score-percent" style={{ color: grade.color }}>{score}%</span>
        </div>
      </div>

      <div className="score-grade" style={{ '--grade-color': grade.color }}>
        <span className="grade-letter">{grade.letter}</span>
        <span className="grade-label">{grade.label}</span>
      </div>

      <div className="score-bar-wrapper">
        <div className="score-bar-track">
          <div
            className="score-bar-fill"
            style={{ width: `${score}%`, background: `linear-gradient(90deg, ${grade.color}88, ${grade.color})` }}
          />
        </div>
        <div className="score-bar-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
