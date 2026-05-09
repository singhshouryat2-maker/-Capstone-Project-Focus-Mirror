import { useState, useCallback, useEffect } from 'react';
import Timer from './components/Timer';
import DistractionButton from './components/DistractionButton';
import FocusScore from './components/FocusScore';
import Analytics from './components/Analytics';
import SessionHistory from './components/SessionHistory';
import StreaksGoals from './components/StreaksGoals';
import Pomodoro from './components/Pomodoro';
import { useTimer } from './hooks/useTimer';
import {
  getSessions,
  saveSession,
  getGoals,
  saveGoals,
  getStreak,
  getTodaySessions,
  calculateFocusScore,
} from './utils/storage';

import './App.css';

function App() {
  const timer = useTimer(25);
  const [distractions, setDistractions] = useState(0);
  const [sessions, setSessions] = useState(getSessions);
  const [goals, setGoals] = useState(getGoals);
  const [streak, setStreak] = useState(getStreak);
  const [todaySessions, setTodaySessions] = useState(getTodaySessions);
  const [currentScore, setCurrentScore] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [activeTab, setActiveTab] = useState('focus'); // focus | pomodoro | analytics

  // Calculate live focus score
  useEffect(() => {
    if (timer.elapsed > 0) {
      setCurrentScore(calculateFocusScore(timer.elapsed, distractions));
    }
  }, [timer.elapsed, distractions]);

  // Handle session complete
  useEffect(() => {
    if (timer.isComplete && sessionActive) {

      const session = {
        focusTime: timer.duration,
        distractions,
        focusScore: calculateFocusScore(timer.duration, distractions),
      };
      const updated = saveSession(session);
      setSessions(updated);
      setTodaySessions(getTodaySessions());
      setStreak(getStreak());
      setSessionActive(false);
    }
  }, [timer.isComplete]);

  const handleStart = useCallback(() => {

    setSessionActive(true);
    setDistractions(0);
    setCurrentScore(100);
  }, []);

  const handleDistract = useCallback(() => {

    setDistractions(d => d + 1);
  }, []);

  const handleGoalsChange = useCallback((newGoals) => {
    saveGoals(newGoals);
    setGoals(newGoals);
  }, []);

  const handleNewSession = useCallback(() => {
    timer.reset();
    setDistractions(0);
    setCurrentScore(0);
    setSessionActive(false);
  }, [timer]);

  return (
    <div className="app" id="focusmirror-app">
      {/* Background effects */}
      <div className="bg-gradient" />
      <div className="bg-grid" />

      {/* Header */}
      <header className="app-header" id="app-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">◎</span>
            <h1 className="logo-text">FocusMirror</h1>
          </div>
          <span className="header-tagline">Real-Time Distraction Tracker</span>
        </div>
        <nav className="header-nav">
          <button
            className={`nav-tab ${activeTab === 'focus' ? 'active' : ''}`}
            onClick={() => setActiveTab('focus')}
            id="nav-focus-tab"
          >
            <span>⏱</span> Focus
          </button>
          <button
            className={`nav-tab ${activeTab === 'pomodoro' ? 'active' : ''}`}
            onClick={() => setActiveTab('pomodoro')}
            id="nav-pomodoro-tab"
          >
            <span>🍅</span> Pomodoro
          </button>
          <button
            className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
            id="nav-analytics-tab"
          >
            <span>📊</span> Analytics
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="app-main">
        {activeTab === 'focus' ? (
          <div className="focus-layout">
            {/* Left column — Timer + Score */}
            <div className="focus-left">
              <Timer
                timer={timer}
                onStart={handleStart}
                onDistractionCount={distractions}
              />
              <FocusScore
                score={currentScore}
                isVisible={sessionActive || timer.isComplete}
              />
            </div>

            {/* Right column — Distraction + Streaks/Goals */}
            <div className="focus-right">
              <DistractionButton
                count={distractions}
                onDistract={handleDistract}
                disabled={!timer.isRunning}
              />
              <StreaksGoals
                streak={streak}
                goals={goals}
                todaySessions={todaySessions}
                onGoalsChange={handleGoalsChange}
              />
            </div>
          </div>
        ) : activeTab === 'pomodoro' ? (
          <Pomodoro />
        ) : (
          <div className="analytics-layout">
            <Analytics sessions={sessions} />
            <div className="analytics-side">
              <SessionHistory sessions={sessions} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <span>Built with focus. Track your distractions. Own your time.</span>
      </footer>
    </div>
  );
}

export default App;
