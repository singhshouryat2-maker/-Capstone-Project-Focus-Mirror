import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Flame,
  GraduationCap,
  Home,
  Layers3,
  LineChart,
  NotebookText,
  Settings,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "notes", label: "Notes", icon: NotebookText },
  { id: "quizzes", label: "Quizzes", icon: CircleHelp },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "settings", label: "Settings", icon: Settings }
];

const subjectData = {
  English: {
    attempt: [28, 52, 62, 38, 45, 72, 55],
    accuracy: [43, 51, 52, 49, 53, 60, 69],
    score: 72,
    strength: "Strong"
  },
  "General Knowledge": {
    attempt: [36, 40, 48, 64, 58, 66, 75],
    accuracy: [39, 45, 43, 55, 64, 62, 70],
    score: 66,
    strength: "Improving"
  },
  History: {
    attempt: [24, 34, 30, 42, 50, 48, 61],
    accuracy: [33, 38, 44, 41, 47, 54, 59],
    score: 61,
    strength: "Steady"
  },
  Quiz: {
    attempt: [40, 46, 55, 53, 65, 72, 78],
    accuracy: [50, 54, 58, 60, 64, 68, 73],
    score: 78,
    strength: "Sharp"
  }
};

const hoursData = [
  { label: "16 Jun", value: 98 },
  { label: "17 Jun", value: 39 },
  { label: "18 Jun", value: 112 },
  { label: "19 Jun", value: 12 },
  { label: "20 Jun", value: 58 },
  { label: "21 Jun", value: 8, today: true },
  { label: "22 Jun", value: 113 }
];

const questionData = [
  { label: "16 Jun", value: 17 },
  { label: "17 Jun", value: 41 },
  { label: "18 Jun", value: 11 },
  { label: "19 Jun", value: 22 },
  { label: "20 Jun", value: 12 },
  { label: "21 Jun", value: 8 },
  { label: "22 Jun", value: 54 }
];

const taskSeeds = [
  { id: 1, title: "Revise English grammar", meta: "45 mins", done: true },
  { id: 2, title: "Solve history mock quiz", meta: "20 questions", done: false },
  { id: 3, title: "Read current affairs notes", meta: "30 mins", done: false }
];

function App() {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="app">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
      <main className="main-panel">
        <div className="status-strip" aria-hidden="true">
          <span className="strip-green" />
          <span className="strip-yellow" />
          <span className="strip-orange" />
          <span className="strip-pink" />
        </div>
        {activeNav === "dashboard" ? (
          <Dashboard />
        ) : (
          <WorkspacePanel section={navItems.find((item) => item.id === activeNav)} />
        )}
      </main>
    </div>
  );
}

function Sidebar({ activeNav, onNavChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <GraduationCap size={27} />
        </div>
        <span>StudyPro</span>
      </div>

      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={`nav-item ${activeNav === item.id ? "active" : ""}`}
              key={item.id}
              onClick={() => onNavChange(item.id)}
              type="button"
            >
              <Icon size={21} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="upgrade-card">
        <div className="crown">♛</div>
        <h3>Upgrade to Pro</h3>
        <p>Unlock all features and boost your productivity.</p>
        <button type="button">Upgrade Now</button>
      </div>

      <button className="profile" type="button">
        <div className="avatar">RS</div>
        <span>
          <strong>Rohan Sharma</strong>
          <small>Level 3 Student</small>
        </span>
        <ChevronDown size={18} />
      </button>
    </aside>
  );
}

function Dashboard() {
  return (
    <section className="dashboard" aria-label="Study dashboard">
      <div className="left-stack">
        <StudyStreakCard />
        <StudyHoursCard compact />
        <QuestionsCard />
        <StudyHoursCard />
      </div>

      <div className="center-stack">
        <StrengthCard />
        <div className="rank-row">
          <RankCard />
          <ActionRail />
        </div>
        <MiniProgressCard />
        <QuestionTrendCard />
      </div>

      <div className="right-stack">
        <CalendarCard />
        <LevelCard />
        <QuickStats />
        <LeaderboardSwitch />
      </div>
    </section>
  );
}

function StudyStreakCard() {
  const [days, setDays] = useState([true, true, true, false, false, false, false]);
  const current = days.filter(Boolean).length;
  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <article className="card streak-card">
      <div className="card-header">
        <div className="icon-box flame">
          <Flame size={22} />
        </div>
        <div>
          <h2>Study Streak</h2>
        </div>
        <button className="link-button" type="button">
          <CalendarDays size={18} />
          Streak Calendar
        </button>
      </div>

      <div className="streak-body">
        <div>
          <span className="muted">Daily Goal</span>
          <strong>Study 60 mins</strong>
        </div>
        <div className="week-track" aria-label="Study streak days">
          {days.map((active, index) => (
            <button
              className={`week-day ${active ? "done" : ""}`}
              key={`${labels[index]}-${index}`}
              onClick={() => {
                setDays((currentDays) =>
                  currentDays.map((value, dayIndex) => (dayIndex === index ? !value : value))
                );
              }}
              title={`Toggle ${labels[index]}`}
              type="button"
            >
              <span />
              <small>{labels[index]}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="summary-row">
        <Metric icon={<Flame size={20} />} label="Current Streak" value={`${current} Days`} />
        <Metric label="Longest Streak" value="12 Days" />
      </div>
    </article>
  );
}

function StrengthCard() {
  const subjects = Object.keys(subjectData);
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [boosts, setBoosts] = useState(0);
  const active = subjectData[activeSubject];
  const adjustedAttempt = active.attempt.map((value, index) =>
    index === active.attempt.length - 1 ? Math.min(96, value + boosts * 4) : value
  );
  const activeScore = Math.min(96, active.score + boosts * 4);

  return (
    <article className="card strength-card">
      <div className="card-header">
        <div className="icon-box purple">
          <LineChart size={23} />
        </div>
        <div>
          <h2>Strengths & Weaknesses</h2>
          <button className="select-button" type="button">
            All Subjects
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="chip-row">
        {subjects.map((subject) => (
          <button
            className={`chip ${activeSubject === subject ? "selected" : ""}`}
            key={subject}
            onClick={() => setActiveSubject(subject)}
            type="button"
          >
            {subject}
          </button>
        ))}
      </div>

      <div className="legend">
        <span>
          <i className="dot purple-dot" />
          Attempt Rate
        </span>
        <span>
          <i className="dot yellow-dot" />
          Accuracy
        </span>
      </div>

      <TrendChart attempt={adjustedAttempt} accuracy={active.accuracy} score={activeScore} />

      <div className="strength-footer">
        <span>Subject Strength</span>
        <span className="strength-meter" aria-label={`${active.strength} subject strength`}>
          <i />
          <i />
          <i />
          <i />
          <i className="faded" />
        </span>
        <strong>🔥 {boosts > 0 ? "Boosted" : active.strength}</strong>
      </div>

      <button className="primary-action" onClick={() => setBoosts((value) => value + 1)} type="button">
        Improve Your Subject Strength
      </button>
    </article>
  );
}

function CalendarCard() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDays, setSelectedDays] = useState([22, 23, 24, 25, 26]);
  const baseDate = new Date(2022, 7 + monthOffset, 1);
  const monthName = baseDate.toLocaleString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1).getDay();
  const blanks = Array.from({ length: firstDay }, (_, index) => `blank-${index}`);
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const toggleDay = (day) => {
    setSelectedDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter((selected) => selected !== day)
        : [...currentDays, day].sort((a, b) => a - b)
    );
  };

  return (
    <article className="card calendar-card">
      <div className="calendar-top">
        <button aria-label="Previous month" onClick={() => setMonthOffset((value) => value - 1)} type="button">
          <ChevronLeft size={25} />
        </button>
        <h2>{monthName}</h2>
        <button aria-label="Next month" onClick={() => setMonthOffset((value) => value + 1)} type="button">
          <ChevronRight size={25} />
        </button>
      </div>

      <div className="calendar-weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {blanks.map((blank) => (
          <span className="calendar-empty" key={blank} />
        ))}
        {days.map((day) => (
          <button
            className={`calendar-day ${selectedDays.includes(day) ? "selected" : ""} ${
              day === 24 || day === 25 ? "range-core" : ""
            } ${day === 26 ? "focused" : ""}`}
            key={day}
            onClick={() => toggleDay(day)}
            type="button"
          >
            {day}
          </button>
        ))}
      </div>

      <div className="summary-row calendar-summary">
        <Metric icon={<Flame size={20} />} label="Current Streak" value={`${selectedDays.length} Days`} />
        <Metric label="Longest Streak" value="12 Days" />
      </div>
    </article>
  );
}

function StudyHoursCard({ compact = false }) {
  const [selected, setSelected] = useState(hoursData[5]);
  const total = hoursData.reduce((sum, item) => sum + item.value, 0);

  return (
    <article className={`card hours-card ${compact ? "compact" : ""}`}>
      <div className="card-header compact-header">
        <div className="icon-box red">
          <Clock3 size={22} />
        </div>
        <div>
          <h2>Total Study Hours</h2>
          <p className="big-number">
            287 <small>+ 6 hrs in last 7 days</small>
          </p>
        </div>
      </div>
      <BarChart
        data={hoursData}
        selected={selected.label}
        onSelect={setSelected}
        mode={compact ? "bars" : "area"}
      />
      <p className="chart-caption">
        {selected.today ? "Today" : selected.label}: {selected.value} mins tracked
      </p>
      {!compact && <AreaLine data={hoursData} />}
    </article>
  );
}

function QuestionsCard() {
  const [correct, setCorrect] = useState(220);
  const incorrect = 289 - correct;
  const accuracy = Math.round((correct / 289) * 100);

  return (
    <article className="card questions-card">
      <div className="card-header compact-header">
        <div className="icon-box blue">
          <CircleHelp size={22} />
        </div>
        <div>
          <h2>Total Questions Attempted</h2>
          <p className="big-number">
            289 <small>+ 22 in last 7 days</small>
          </p>
        </div>
      </div>
      <div className="stat-grid">
        <button type="button" onClick={() => setCorrect((value) => Math.min(289, value + 1))}>
          <CheckSquare size={20} />
          <span>Correct</span>
          <strong>{correct}</strong>
        </button>
        <button type="button" onClick={() => setCorrect((value) => Math.max(0, value - 1))}>
          <CircleHelp size={20} />
          <span>Incorrect</span>
          <strong>{incorrect}</strong>
        </button>
        <div>
          <Target size={20} />
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>
        <div>
          <Zap size={20} />
          <span>Speed</span>
          <strong>9 Sec/Q</strong>
        </div>
      </div>
    </article>
  );
}

function RankCard() {
  const [rank, setRank] = useState(1255);
  const progress = Math.max(4, Math.min(96, 100 - (rank - 900) / 8));

  return (
    <article className="card rank-card">
      <div>
        <h2>Your Predicted Rank</h2>
        <strong>{rank}</strong>
        <input
          aria-label="Predicted rank"
          max="1500"
          min="900"
          onChange={(event) => setRank(Number(event.target.value))}
          type="range"
          value={rank}
        />
      </div>
      <div className="rank-badge">
        <Trophy size={35} />
      </div>
      <div className="rank-scale" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
    </article>
  );
}

function ActionRail() {
  const [active, setActive] = useState("target");
  return (
    <div className="action-rail">
      <button
        className={active === "target" ? "active" : ""}
        onClick={() => setActive("target")}
        title="Focus goal"
        type="button"
      >
        <Target size={28} />
      </button>
      <button
        className={active === "help" ? "active" : ""}
        onClick={() => setActive("help")}
        title="Practice help"
        type="button"
      >
        <CircleHelp size={28} />
      </button>
    </div>
  );
}

function MiniProgressCard() {
  const [tests, setTests] = useState(456);
  const [notes, setNotes] = useState(450);

  return (
    <article className="card mini-progress">
      <button type="button" onClick={() => setTests((value) => Math.min(457, value + 1))}>
        <span className="icon-box green">
          <CheckSquare size={22} />
        </span>
        <span>
          <small>Tests Attempted</small>
          <strong>{tests}<em>/457</em></strong>
        </span>
      </button>
      <button type="button" onClick={() => setNotes((value) => Math.min(457, value + 1))}>
        <span className="icon-box purple">
          <BookOpen size={22} />
        </span>
        <span>
          <small>Notes Read</small>
          <strong>{notes}<em>/457</em></strong>
        </span>
      </button>
    </article>
  );
}

function QuestionTrendCard() {
  const [selected, setSelected] = useState(questionData[6]);

  return (
    <article className="card question-trend">
      <div className="card-header compact-header">
        <div className="icon-box blue">
          <CircleHelp size={22} />
        </div>
        <div>
          <h2>Total Questions Attempted</h2>
          <p className="big-number">
            289 <small>+ 22 in last 7 days</small>
          </p>
        </div>
      </div>
      <MiniBarChart data={questionData} selected={selected.label} onSelect={setSelected} />
      <p className="chart-caption">
        {selected.label}: {selected.value} questions
      </p>
    </article>
  );
}

function LevelCard() {
  const [points, setPoints] = useState(440);
  const levelProgress = Math.min(100, Math.round(((500 - points) / 500) * 100));

  return (
    <article className="card level-card">
      <div className="level-pill active">
        <span>LVL</span>
        <strong>3</strong>
      </div>
      <div className="level-middle">
        <button type="button" onClick={() => setPoints((value) => Math.max(0, value - 20))}>
          <ChevronDown size={22} />
        </button>
        <div className="level-line">
          <span style={{ width: `${levelProgress}%` }} />
        </div>
        <strong>{points}</strong>
        <small>Points Needed</small>
      </div>
      <div className="level-pill">
        <span>LVL</span>
        <strong>4</strong>
      </div>
    </article>
  );
}

function QuickStats() {
  const [active, setActive] = useState("Tests");
  const stats = [
    { label: "Tests", icon: CheckSquare, value: "1,237" },
    { label: "Practice", icon: Clock3, value: "1,237" },
    { label: "Quizzes", icon: Target, value: "1,237" }
  ];

  return (
    <div className="quick-stats">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <button
            className={`card quick-card ${active === stat.label ? "active" : ""}`}
            key={stat.label}
            onClick={() => setActive(stat.label)}
            type="button"
          >
            <Icon size={25} />
            <span>{stat.label} Attempted</span>
            <strong>{stat.value}</strong>
          </button>
        );
      })}
    </div>
  );
}

function LeaderboardSwitch() {
  const [tab, setTab] = useState("stats");

  return (
    <article className="card tab-switch">
      <button className={tab === "stats" ? "active" : ""} onClick={() => setTab("stats")} type="button">
        Your Stats
      </button>
      <button
        className={tab === "leaderboard" ? "active" : ""}
        onClick={() => setTab("leaderboard")}
        type="button"
      >
        Leaderboard
      </button>
    </article>
  );
}

function WorkspacePanel({ section }) {
  const [tasks, setTasks] = useState(taskSeeds);
  const Icon = section.icon;
  const completeCount = tasks.filter((task) => task.done).length;

  return (
    <section className="workspace-view">
      <div className="workspace-header">
        <span className="icon-box blue">
          <Icon size={24} />
        </span>
        <div>
          <h1>{section.label}</h1>
          <p>Plan, track, and finish your study work from one clean control center.</p>
        </div>
      </div>

      <div className="workspace-grid">
        <article className="card task-manager-card">
          <div className="card-header">
            <div>
              <h2>Today&apos;s Tasks</h2>
              <p className="muted">{completeCount} of {tasks.length} completed</p>
            </div>
            <button
              className="primary-small"
              onClick={() =>
                setTasks((currentTasks) => [
                  ...currentTasks,
                  {
                    id: Date.now(),
                    title: `New ${section.label.toLowerCase()} task`,
                    meta: "15 mins",
                    done: false
                  }
                ])
              }
              type="button"
            >
              Add Task
            </button>
          </div>
          <div className="task-list">
            {tasks.map((task) => (
              <label className={`task-item ${task.done ? "done" : ""}`} key={task.id}>
                <input
                  checked={task.done}
                  onChange={() =>
                    setTasks((currentTasks) =>
                      currentTasks.map((item) =>
                        item.id === task.id ? { ...item, done: !item.done } : item
                      )
                    )
                  }
                  type="checkbox"
                />
                <span>
                  <strong>{task.title}</strong>
                  <small>{task.meta}</small>
                </span>
              </label>
            ))}
          </div>
        </article>

        <article className="card focus-card">
          <h2>Focus Progress</h2>
          <div className="focus-ring" style={{ "--progress": `${completeCount / tasks.length}` }}>
            <strong>{Math.round((completeCount / tasks.length) * 100)}%</strong>
          </div>
          <p>Keep the most important work visible and clickable.</p>
        </article>

        <article className="card notes-card">
          <h2>Quick Notes</h2>
          <textarea defaultValue={`Write your ${section.label.toLowerCase()} notes here...`} />
        </article>
      </div>
    </section>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="metric">
      {icon && <span>{icon}</span>}
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function TrendChart({ attempt, accuracy, score }) {
  const labels = ["15 Jun", "16 Jun", "17 Jun", "18 Jun", "19 Jun", "20 Jun", "21 Jun", "22 Jun"];
  const width = 620;
  const height = 290;
  const padding = { top: 22, right: 28, bottom: 42, left: 54 };
  const makePoint = (value, index, list) => {
    const x = padding.left + (index * (width - padding.left - padding.right)) / (list.length - 1);
    const y = padding.top + ((100 - value) * (height - padding.top - padding.bottom)) / 100;
    return [x, y];
  };
  const attemptPoints = attempt.map(makePoint);
  const accuracyPoints = accuracy.map(makePoint);
  const attemptPath = smoothPath(attemptPoints);
  const accuracyPath = smoothPath(accuracyPoints);
  const activePoint = attemptPoints[attemptPoints.length - 2];

  return (
    <div className="trend-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Subject attempt and accuracy chart">
        {[100, 80, 60, 40, 20].map((tick) => {
          const y = padding.top + ((100 - tick) * (height - padding.top - padding.bottom)) / 100;
          return (
            <g key={tick}>
              <line className="grid-line" x1={padding.left} x2={width - padding.right} y1={y} y2={y} />
              <text className="axis-label" x={16} y={y + 5}>
                {tick}%
              </text>
            </g>
          );
        })}
        <path className="line yellow-line" d={accuracyPath} />
        <path className="line purple-line" d={attemptPath} />
        <line className="active-guide" x1={activePoint[0]} x2={activePoint[0]} y1={activePoint[1]} y2={height - 54} />
        <circle className="active-dot" cx={activePoint[0]} cy={activePoint[1]} r="9" />
        <g className="tooltip-bubble" transform={`translate(${activePoint[0] - 36} ${activePoint[1] - 72})`}>
          <rect rx="8" width="72" height="48" />
          <text x="36" y="30">
            {score}%
          </text>
        </g>
        {labels.map((label, index) => {
          const x = padding.left + (index * (width - padding.left - padding.right)) / (labels.length - 1);
          return (
            <text className="date-label" key={label} x={x} y={height - 12}>
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function BarChart({ data, selected, onSelect, mode }) {
  const max = Math.max(...data.map((item) => item.value), 120);
  return (
    <div className="bar-chart" data-mode={mode}>
      <span className="y-label">Mins</span>
      <div className="bar-area">
        {[120, 90, 60, 30, 0].map((tick) => (
          <span className="bar-grid" key={tick} style={{ bottom: `${(tick / 120) * 100}%` }}>
            {tick}
          </span>
        ))}
        {data.map((item) => (
          <button
            className={`bar-button ${selected === item.label ? "selected" : ""} ${item.today ? "today" : ""}`}
            key={item.label}
            onClick={() => onSelect(item)}
            style={{ "--height": `${(item.value / max) * 100}%` }}
            title={`${item.label}: ${item.value} mins`}
            type="button"
          >
            <span className="bar-fill" />
            <small>{item.today ? "Today" : item.label}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function AreaLine({ data }) {
  const points = data.map((item, index) => {
    const x = 12 + (index * 76) / (data.length - 1);
    const y = 86 - (item.value / 120) * 38;
    return [x, y];
  });
  const path = smoothPath(points);
  const areaPath = `${path} L 88 96 L 12 96 Z`;

  return (
    <svg className="area-overlay" viewBox="0 0 100 100" aria-hidden="true">
      <path className="area-fill" d={areaPath} />
      <path className="area-line" d={path} />
    </svg>
  );
}

function MiniBarChart({ data, selected, onSelect }) {
  const max = Math.max(...data.map((item) => item.value));
  return (
    <div className="mini-bars">
      <span>Mins</span>
      {data.map((item) => (
        <button
          className={selected === item.label ? "selected" : ""}
          key={item.label}
          onClick={() => onSelect(item)}
          style={{ "--height": `${(item.value / max) * 100}%` }}
          title={`${item.value} questions`}
          type="button"
        >
          <i />
          <small>{item.label}</small>
        </button>
      ))}
    </div>
  );
}

function smoothPath(points) {
  return points.reduce((path, point, index, allPoints) => {
    if (index === 0) return `M ${point[0]} ${point[1]}`;
    const previous = allPoints[index - 1];
    const midX = (previous[0] + point[0]) / 2;
    return `${path} C ${midX} ${previous[1]}, ${midX} ${point[1]}, ${point[0]} ${point[1]}`;
  }, "");
}

export default App;
