const STORAGE_KEY = 'focusmirror_sessions';
const GOALS_KEY = 'focusmirror_goals';
const STREAK_KEY = 'focusmirror_streak';

export function getSessions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSession(session) {
  const sessions = getSessions();
  sessions.push({
    ...session,
    id: Date.now(),
    date: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  updateStreak();
  return sessions;
}

export function getGoals() {
  try {
    const data = localStorage.getItem(GOALS_KEY);
    return data ? JSON.parse(data) : { maxDistractions: 3, minFocusScore: 80 };
  } catch {
    return { maxDistractions: 3, minFocusScore: 80 };
  }
}

export function saveGoals(goals) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function getStreak() {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : { current: 0, best: 0, lastDate: null };
  } catch {
    return { current: 0, best: 0, lastDate: null };
  }
}

function updateStreak() {
  const streak = getStreak();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (streak.lastDate === today) return; // Already logged today

  if (streak.lastDate === yesterday) {
    streak.current += 1;
  } else if (streak.lastDate !== today) {
    streak.current = 1;
  }

  streak.best = Math.max(streak.best, streak.current);
  streak.lastDate = today;
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

export function getTodaySessions() {
  const today = new Date().toDateString();
  return getSessions().filter(s => new Date(s.date).toDateString() === today);
}

export function getWeekSessions() {
  const weekAgo = Date.now() - 7 * 86400000;
  return getSessions().filter(s => new Date(s.date).getTime() > weekAgo);
}

export function calculateFocusScore(focusTimeSeconds, distractions) {
  const penalty = 30; // 30 seconds penalty per distraction
  const focusTime = focusTimeSeconds;
  const totalPenalty = distractions * penalty;
  if (focusTime + totalPenalty === 0) return 0;
  return Math.round((focusTime / (focusTime + totalPenalty)) * 100);
}
