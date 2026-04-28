import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Clock3,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Save,
  Sparkles,
  Sun,
  Target,
  TrendingUp
} from "lucide-react";
import "./focus-mirror.css";

const SESSION_KEY = "focusmirror:sessions:v1";
const PREFS_KEY = "focusmirror:prefs:v1";
const DEFAULT_DURATION = 25;
const DEFAULT_PENALTY = 90;
const DEFAULT_GOAL = 3;

function FocusMirror() {
  const initialPrefs = useMemo(loadPrefs, []);
  const [sessions, setSessions] = useState(loadSessions);
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_DURATION);
  const [penaltySeconds, setPenaltySeconds] = useState(DEFAULT_PENALTY);
  const [goalDistractions, setGoalDistractions] = useState(DEFAULT_GOAL);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_DURATION * 60);
  const [focusedSeconds, setFocusedSeconds] = useState(0);
  const [distractions, setDistractions] = useState([]);
  const [sessionStartISO, setSessionStartISO] = useState(null);
  const [darkMode, setDarkMode] = useState(initialPrefs.darkMode);
  const [soundEnabled, setSoundEnabled] = useState(initialPrefs.soundEnabled);
  const [lastSavedSessionId, setLastSavedSessionId] = useState(null);

  const sessionSeconds = durationMinutes * 60;
  const elapsedSeconds = Math.max(0, sessionSeconds - remainingSeconds);
  const liveScore = calculateScore(focusedSeconds, distractions.length, penaltySeconds);
  const progressPercent = Math.round((elapsedSeconds / Math.max(sessionSeconds, 1)) * 100);

  const persistSession = useCallback(
    (status = "manual") => {
      const isEmptySession = focusedSeconds === 0 && distractions.length === 0;
      if (isEmptySession) return;

      const end = new Date();
      const startISO = sessionStartISO ?? end.toISOString();
      const start = new Date(startISO);
      const id = makeSessionId();
      const score = calculateScore(focusedSeconds, distractions.length, penaltySeconds);
      const savedSession = {
        id,
        date: formatDate(start),
        startedAt: startISO,
        endedAt: end.toISOString(),
        focusTime: Number((focusedSeconds / 60).toFixed(1)),
        focusSeconds: focusedSeconds,
        plannedMinutes: durationMinutes,
        distractions: distractions.length,
        distractionMoments: distractions.map((item) => item.elapsedSeconds),
        penalty: penaltySeconds,
        score,
        timeBand: getTimeBand(start.getHours()),
        goalLimit: goalDistractions,
        goalHit: distractions.length <= goalDistractions,
        status
      };

      setSessions((prev) => [savedSession, ...prev].slice(0, 150));
      setLastSavedSessionId(id);
      if (soundEnabled) playCompletionSound();
      setIsRunning(false);
      setFocusedSeconds(0);
      setDistractions([]);
      setSessionStartISO(null);
      setRemainingSeconds(durationMinutes * 60);
    },
    [
      focusedSeconds,
      distractions,
      penaltySeconds,
      durationMinutes,
      sessionStartISO,
      goalDistractions,
      soundEnabled
    ]
  );

  useEffect(() => {
    if (!isRunning) return undefined;
    const tick = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setFocusedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(tick);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && remainingSeconds === 0) persistSession("complete");
  }, [isRunning, remainingSeconds, persistSession]);

  useEffect(() => {
    if (!isRunning && focusedSeconds === 0 && distractions.length === 0) {
      setRemainingSeconds(durationMinutes * 60);
    }
  }, [durationMinutes, isRunning, focusedSeconds, distractions.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PREFS_KEY, JSON.stringify({ darkMode, soundEnabled }));
  }, [darkMode, soundEnabled]);

  const analytics = useMemo(() => {
    const totalFocusSeconds = sessions.reduce((sum, item) => sum + (item.focusSeconds ?? 0), 0);
    const totalDistractions = sessions.reduce((sum, item) => sum + (item.distractions ?? 0), 0);
    const averageScore = sessions.length
      ? Math.round(sessions.reduce((sum, item) => sum + (item.score ?? 0), 0) / sessions.length)
      : 0;
    const sessionsToday = sessions.filter((item) => item.date === formatDate(new Date())).length;
    const currentStreak = countCurrentStreakDays(sessions);
    const avgDistractionsPerSession = sessions.length
      ? Number((totalDistractions / sessions.length).toFixed(1))
      : 0;
    const firstDistractionMinutes = sessions
      .filter((item) => Array.isArray(item.distractionMoments) && item.distractionMoments.length > 0)
      .map((item) => item.distractionMoments[0] / 60);
    const avgFirstDistractionMinute = firstDistractionMinutes.length
      ? Math.round(firstDistractionMinutes.reduce((sum, value) => sum + value, 0) / firstDistractionMinutes.length)
      : null;

    const weekSeries = lastSevenDays().map((day) => {
      const sessionsInDay = sessions.filter((item) => item.date === day.key);
      return {
        ...day,
        focusMinutes: Number(
          sessionsInDay.reduce((sum, item) => sum + (item.focusTime ?? 0), 0).toFixed(1)
        ),
        distractions: sessionsInDay.reduce((sum, item) => sum + (item.distractions ?? 0), 0),
        count: sessionsInDay.length
      };
    });

    const maxFocusMinutes = Math.max(1, ...weekSeries.map((entry) => entry.focusMinutes));
    const byTimeBand = sessions.reduce((map, item) => {
      const key = item.timeBand || "Unknown";
      const existing = map.get(key) ?? { scoreSum: 0, count: 0 };
      existing.scoreSum += item.score ?? 0;
      existing.count += 1;
      map.set(key, existing);
      return map;
    }, new Map());
    let bestWindow = "No pattern yet";
    let bestWindowScore = -1;
    for (const [timeBand, data] of byTimeBand.entries()) {
      const avg = data.scoreSum / data.count;
      if (avg > bestWindowScore) {
        bestWindowScore = avg;
        bestWindow = timeBand;
      }
    }

    const goalHitRate = sessions.length
      ? Math.round((sessions.filter((item) => item.goalHit).length / sessions.length) * 100)
      : 0;

    return {
      totalFocusHours: Number((totalFocusSeconds / 3600).toFixed(1)),
      totalDistractions,
      averageScore,
      sessionsToday,
      currentStreak,
      avgDistractionsPerSession,
      avgFirstDistractionMinute,
      bestWindow,
      goalHitRate,
      weekSeries,
      maxFocusMinutes
    };
  }, [sessions]);

  const insightMessages = useMemo(() => {
    const notes = [];

    if (!sessions.length) {
      notes.push("No completed sessions yet. Start one to unlock your focus pattern.");
      return notes;
    }

    if (analytics.avgFirstDistractionMinute !== null) {
      notes.push(`You usually get distracted around minute ${analytics.avgFirstDistractionMinute}.`);
    } else {
      notes.push("You are keeping sustained focus in most sessions with zero distractions.");
    }

    notes.push(`Your strongest time block is ${analytics.bestWindow}.`);

    if (analytics.avgDistractionsPerSession > goalDistractions) {
      notes.push(
        `Average distractions are ${analytics.avgDistractionsPerSession} per session. Lowering to ${goalDistractions} would improve your score quickly.`
      );
    } else {
      notes.push(`You are meeting your distraction goal in ${analytics.goalHitRate}% of sessions.`);
    }

    if (analytics.currentStreak >= 3) {
      notes.push(`You are on a ${analytics.currentStreak}-day streak. Keep the same start time tomorrow.`);
    }

    return notes;
  }, [analytics, sessions.length, goalDistractions]);

  function toggleRun() {
    if (isRunning) {
      setIsRunning(false);
      return;
    }
    if (!sessionStartISO) setSessionStartISO(new Date().toISOString());
    setIsRunning(true);
  }

  function resetLiveSession() {
    setIsRunning(false);
    setFocusedSeconds(0);
    setDistractions([]);
    setSessionStartISO(null);
    setRemainingSeconds(durationMinutes * 60);
    setLastSavedSessionId(null);
  }

  function markDistraction() {
    if (!isRunning) return;
    setDistractions((prev) => [
      ...prev,
      {
        at: new Date().toISOString(),
        elapsedSeconds
      }
    ]);
  }

  function clearHistory() {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Delete all saved FocusMirror sessions from local storage?");
      if (!ok) return;
    }
    setSessions([]);
  }

  const recentSessions = sessions.slice(0, 8);

  return (
    <div className={`focusmirror ${darkMode ? "dark" : ""}`}>
      <div className="fm-shell">
        <header className="fm-header">
          <div>
            <p className="fm-kicker">Behavior Dashboard</p>
            <h1>FocusMirror</h1>
            <p className="fm-subtitle">
              Real-time distraction tracking to show where your study time actually goes.
            </p>
          </div>
          <div className="fm-header-actions">
            <button className="ghost-btn" onClick={() => setSoundEnabled((prev) => !prev)} type="button">
              <Bell size={18} />
              Sound {soundEnabled ? "On" : "Off"}
            </button>
            <button className="ghost-btn" onClick={() => setDarkMode((prev) => !prev)} type="button">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? "Light" : "Dark"} Mode
            </button>
          </div>
        </header>

        <main className="fm-grid">
          <section className="fm-card timer-card">
            <div className="card-title-row">
              <div>
                <h2>
                  <Clock3 size={18} />
                  Focus Timer
                </h2>
                <p>Run a session and log distractions the second they happen.</p>
              </div>
              <div className="preset-row" role="group" aria-label="Session presets">
                {[15, 25, 45, 60].map((preset) => (
                  <button
                    className={durationMinutes === preset ? "active" : ""}
                    disabled={isRunning}
                    key={preset}
                    onClick={() => setDurationMinutes(preset)}
                    type="button"
                  >
                    {preset}m
                  </button>
                ))}
              </div>
            </div>

            <div className="timer-layout">
              <div className="timer-ring" style={{ "--progress": progressPercent }}>
                <div>
                  <small>Remaining</small>
                  <strong>{toClock(remainingSeconds)}</strong>
                  <span>{durationMinutes} min plan</span>
                </div>
              </div>

              <div className="live-controls">
                <div className="button-row">
                  <button className="primary-btn" onClick={toggleRun} type="button">
                    {isRunning ? <Pause size={18} /> : <Play size={18} />}
                    {isRunning ? "Pause" : "Start"}
                  </button>
                  <button className="ghost-btn" onClick={resetLiveSession} type="button">
                    <RotateCcw size={18} />
                    Reset
                  </button>
                  <button className="ghost-btn" onClick={() => persistSession("manual")} type="button">
                    <Save size={18} />
                    Save Session
                  </button>
                </div>

                <button
                  className={`distraction-btn ${isRunning ? "armed" : ""}`}
                  disabled={!isRunning}
                  onClick={markDistraction}
                  type="button"
                >
                  <AlertTriangle size={18} />
                  Distracted
                  <span>{distractions.length}</span>
                </button>

                <div className="live-metrics">
                  <p>
                    Focused Time
                    <strong>{toClock(focusedSeconds)}</strong>
                  </p>
                  <p>
                    Penalty/Distraction
                    <strong>{Math.round(penaltySeconds / 60)} min</strong>
                  </p>
                  <p>
                    Live Focus Score
                    <strong>{liveScore}%</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="settings-row">
              <label>
                Session Length
                <input
                  disabled={isRunning}
                  max="90"
                  min="10"
                  onChange={(event) => setDurationMinutes(Number(event.target.value))}
                  type="range"
                  value={durationMinutes}
                />
                <span>{durationMinutes} minutes</span>
              </label>
              <label>
                Distraction Penalty
                <input
                  max="300"
                  min="30"
                  onChange={(event) => setPenaltySeconds(Number(event.target.value))}
                  step="15"
                  type="range"
                  value={penaltySeconds}
                />
                <span>{Math.round(penaltySeconds / 60)} minutes</span>
              </label>
              <label>
                Goal: Max Distractions
                <input
                  max="10"
                  min="1"
                  onChange={(event) => setGoalDistractions(Number(event.target.value))}
                  type="number"
                  value={goalDistractions}
                />
              </label>
            </div>

            <div className="distraction-log">
              <h3>Distraction Timeline</h3>
              {distractions.length ? (
                <ul>
                  {distractions.map((item, idx) => (
                    <li key={`${item.at}-${idx}`}>
                      Minute {Math.max(1, Math.round(item.elapsedSeconds / 60))} of session
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Log appears here while your timer runs.</p>
              )}
            </div>
          </section>

          <section className="fm-card score-card">
            <div className="card-title-row">
              <h2>
                <Target size={18} />
                Live Summary
              </h2>
            </div>

            <div className="score-pill">
              <small>Focus Score</small>
              <strong>{liveScore}%</strong>
              <span>Focus / (Focus + Distractions x Penalty)</span>
            </div>

            <div className="stats-grid">
              <article>
                <small>Total Focus</small>
                <strong>{analytics.totalFocusHours}h</strong>
              </article>
              <article>
                <small>Total Distractions</small>
                <strong>{analytics.totalDistractions}</strong>
              </article>
              <article>
                <small>Average Score</small>
                <strong>{analytics.averageScore}%</strong>
              </article>
              <article>
                <small>Sessions Today</small>
                <strong>{analytics.sessionsToday}</strong>
              </article>
            </div>

            <div className="goal-block">
              <p>
                <TrendingUp size={16} />
                Goal Hit Rate
              </p>
              <strong>{analytics.goalHitRate}%</strong>
              <span>{analytics.currentStreak} day streak active</span>
            </div>
          </section>

          <section className="fm-card analytics-card">
            <div className="card-title-row">
              <h2>
                <BarChart3 size={18} />
                Session Pattern (Last 7 Days)
              </h2>
            </div>

            <div className="bars">
              {analytics.weekSeries.map((day) => (
                <div className="bar-wrap" key={day.key}>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${Math.max(5, (day.focusMinutes / analytics.maxFocusMinutes) * 100)}%` }}
                      title={`${day.focusMinutes} min focus`}
                    />
                  </div>
                  <strong>{day.focusMinutes}m</strong>
                  <small>{day.label}</small>
                  <span>{day.distractions} distractions</span>
                </div>
              ))}
            </div>
          </section>

          <section className="fm-card insights-card">
            <div className="card-title-row">
              <h2>
                <Sparkles size={18} />
                Insight Generator
              </h2>
            </div>

            <ul className="insight-list">
              {insightMessages.map((insight, index) => (
                <li key={`${insight}-${index}`}>{insight}</li>
              ))}
            </ul>
          </section>

          <section className="fm-card history-card">
            <div className="history-head">
              <h2>Session History</h2>
              <button className="ghost-btn" onClick={clearHistory} type="button">
                Clear History
              </button>
            </div>

            {recentSessions.length ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Start</th>
                      <th>Focus Time</th>
                      <th>Distractions</th>
                      <th>Score</th>
                      <th>Goal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.map((session) => (
                      <tr
                        className={session.id === lastSavedSessionId ? "saved-row" : ""}
                        key={session.id}
                      >
                        <td>{session.date}</td>
                        <td>{new Date(session.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                        <td>{session.focusTime} min</td>
                        <td>{session.distractions}</td>
                        <td>{session.score}%</td>
                        <td>
                          <span className={`goal-chip ${session.goalHit ? "hit" : "miss"}`}>
                            {session.goalHit ? "Hit" : "Miss"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-state">No sessions saved yet.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function loadSessions() {
  if (typeof window === "undefined") return seedSessions();
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) {
    const initial = seedSessions();
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedSessions();
  } catch {
    return seedSessions();
  }
}

function loadPrefs() {
  if (typeof window === "undefined") return { darkMode: false, soundEnabled: true };
  const raw = window.localStorage.getItem(PREFS_KEY);
  if (!raw) return { darkMode: false, soundEnabled: true };
  try {
    const parsed = JSON.parse(raw);
    return {
      darkMode: Boolean(parsed.darkMode),
      soundEnabled: parsed.soundEnabled !== false
    };
  } catch {
    return { darkMode: false, soundEnabled: true };
  }
}

function seedSessions() {
  const now = new Date();
  const samples = [
    { offset: 0, hour: 9, focusMinutes: 25, distractions: 1, moments: [680] },
    { offset: 1, hour: 20, focusMinutes: 30, distractions: 3, moments: [450, 1000, 1300] },
    { offset: 2, hour: 10, focusMinutes: 45, distractions: 2, moments: [960, 1700] },
    { offset: 3, hour: 15, focusMinutes: 25, distractions: 4, moments: [420, 800, 1020, 1200] },
    { offset: 4, hour: 8, focusMinutes: 20, distractions: 1, moments: [760] },
    { offset: 5, hour: 22, focusMinutes: 35, distractions: 2, moments: [840, 1240] },
    { offset: 6, hour: 11, focusMinutes: 50, distractions: 1, moments: [1320] }
  ];

  return samples.map((item) => {
    const start = new Date(now);
    start.setDate(start.getDate() - item.offset);
    start.setHours(item.hour, 0, 0, 0);
    const focusSeconds = item.focusMinutes * 60;
    return {
      id: makeSessionId(),
      date: formatDate(start),
      startedAt: start.toISOString(),
      endedAt: new Date(start.getTime() + focusSeconds * 1000).toISOString(),
      focusTime: item.focusMinutes,
      focusSeconds,
      plannedMinutes: item.focusMinutes,
      distractions: item.distractions,
      distractionMoments: item.moments,
      penalty: DEFAULT_PENALTY,
      score: calculateScore(focusSeconds, item.distractions, DEFAULT_PENALTY),
      timeBand: getTimeBand(item.hour),
      goalLimit: DEFAULT_GOAL,
      goalHit: item.distractions <= DEFAULT_GOAL,
      status: "seed"
    };
  });
}

function calculateScore(focusSeconds, distractions, penaltySeconds) {
  const denominator = focusSeconds + distractions * penaltySeconds;
  if (denominator <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((focusSeconds / denominator) * 100)));
}

function toClock(seconds) {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTimeBand(hour) {
  if (hour < 6) return "Late Night";
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  if (hour < 21) return "Evening";
  return "Night";
}

function lastSevenDays() {
  const days = [];
  for (let index = 6; index >= 0; index -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - index);
    days.push({
      key: formatDate(day),
      label: day.toLocaleDateString("en-US", { weekday: "short" })
    });
  }
  return days;
}

function countCurrentStreakDays(sessions) {
  if (!sessions.length) return 0;
  const daySet = new Set(sessions.map((item) => item.date));
  let streak = 0;
  let cursor = new Date();
  while (daySet.has(formatDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function makeSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `fm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function playCompletionSound() {
  try {
    if (typeof window === "undefined" || typeof window.AudioContext === "undefined") return;
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(420, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(680, audioContext.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.16, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.42);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.42);
    oscillator.onended = () => audioContext.close();
  } catch {
    // No-op when sound playback is blocked by browser policy.
  }
}

export default FocusMirror;
