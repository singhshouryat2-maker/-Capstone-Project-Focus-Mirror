import { useState } from 'react';
import './StreaksGoals.css';

export default function StreaksGoals({ streak, goals, todaySessions, onGoalsChange }) {
  const [editing, setEditing] = useState(false);
  const [tempGoals, setTempGoals] = useState(goals);

  const todayDistractions = todaySessions.reduce((s, x) => s + x.distractions, 0);
  const todayAvgScore = todaySessions.length > 0
    ? Math.round(todaySessions.reduce((s, x) => s + x.focusScore, 0) / todaySessions.length)
    : 0;

  const distractionGoalMet = todaySessions.length > 0 && todayDistractions <= goals.maxDistractions * todaySessions.length;
  const scoreGoalMet = todaySessions.length > 0 && todayAvgScore >= goals.minFocusScore;

  const handleSave = () => {
    onGoalsChange(tempGoals);
    setEditing(false);
  };

  // Generate flame emojis for streak
  const streakEmojis = streak.current >= 7 ? '🔥🔥🔥' : streak.current >= 3 ? '🔥🔥' : streak.current >= 1 ? '🔥' : '❄️';

  return (
    <div className="streaks-goals-card" id="streaks-goals-card">
      {/* Streak section */}
      <div className="streak-section">
        <div className="streak-display">
          <span className="streak-fire">{streakEmojis}</span>
          <div className="streak-info">
            <span className="streak-count">{streak.current}</span>
            <span className="streak-label">Day Streak</span>
          </div>
        </div>
        <div className="streak-best">
          <span className="streak-best-label">Best</span>
          <span className="streak-best-value">{streak.best}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="sg-divider" />

      {/* Goals section */}
      <div className="goals-section">
        <div className="goals-header">
          <h3 className="goals-title">🎯 Daily Goals</h3>
          <button
            className="goals-edit-btn"
            onClick={() => editing ? handleSave() : setEditing(true)}
            id="goals-edit-btn"
          >
            {editing ? '✓ Save' : '✎ Edit'}
          </button>
        </div>

        {editing ? (
          <div className="goals-edit-form">
            <label className="goal-input-group">
              <span>Max distractions per session</span>
              <input
                type="number"
                min="1"
                max="20"
                value={tempGoals.maxDistractions}
                onChange={e => setTempGoals(g => ({ ...g, maxDistractions: parseInt(e.target.value) || 1 }))}
                id="goal-max-distractions-input"
              />
            </label>
            <label className="goal-input-group">
              <span>Min focus score</span>
              <input
                type="number"
                min="10"
                max="100"
                value={tempGoals.minFocusScore}
                onChange={e => setTempGoals(g => ({ ...g, minFocusScore: parseInt(e.target.value) || 10 }))}
                id="goal-min-score-input"
              />
            </label>
          </div>
        ) : (
          <div className="goals-status">
            <div className={`goal-item ${todaySessions.length === 0 ? 'pending' : distractionGoalMet ? 'met' : 'missed'}`}>
              <span className="goal-icon">{todaySessions.length === 0 ? '○' : distractionGoalMet ? '✓' : '✗'}</span>
              <span className="goal-text">Under {goals.maxDistractions} distractions/session</span>
            </div>
            <div className={`goal-item ${todaySessions.length === 0 ? 'pending' : scoreGoalMet ? 'met' : 'missed'}`}>
              <span className="goal-icon">{todaySessions.length === 0 ? '○' : scoreGoalMet ? '✓' : '✗'}</span>
              <span className="goal-text">Focus score ≥ {goals.minFocusScore}%</span>
            </div>
            <div className={`goal-item ${todaySessions.length === 0 ? 'pending' : 'met'}`}>
              <span className="goal-icon">{todaySessions.length === 0 ? '○' : '✓'}</span>
              <span className="goal-text">Complete at least 1 session</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
