<div align="center">

# ◎ FocusMirror

### Real-Time Distraction Tracker & Focus Analytics

> _"Where is my time actually going when I study?"_

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/CSS-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML](https://img.shields.io/badge/HTML-Structure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**FocusMirror** is a self-awareness productivity tool that tracks your focus behavior in real-time. Unlike traditional task managers or to-do apps, FocusMirror doesn't care _what_ you're working on — it measures _how well_ you're focusing while doing it.

[Features](#-features) · [How It Works](#-how-it-works) · [Installation](#-installation) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack)

</div>

---

## 🧠 The Problem

Every student and professional knows the feeling: you sit down to study for 2 hours, but when you look back, you realize half that time was spent checking your phone, scrolling social media, or daydreaming. **You don't have a time problem — you have a focus problem.**

Existing tools solve the wrong thing:
- ❌ **To-do apps** track _what_ to do, not _how well_ you did it
- ❌ **Pomodoro timers** run a clock but don't measure behavior
- ❌ **Habit trackers** check if you showed up, not if you were present

**FocusMirror fills the gap** — it's the missing feedback loop between _sitting down to work_ and _actually working_.

---

## 💡 The Idea

FocusMirror answers one simple question:

> **"How focused was I during this session?"**

It does this by combining a **focus timer** with a **self-reported distraction tracker**. Every time you catch yourself losing focus — checking your phone, switching tabs, zoning out — you tap the **"Distracted!"** button. At the end of the session, the app calculates a **Focus Score** based on your behavior and shows you patterns over time.

The brilliance is in its simplicity: **the user is both the subject and the observer.** The act of logging distractions itself builds self-awareness, which research shows is the first step to behavior change.

---

## ✨ Features

### ⏱️ Focus Timer
A configurable Pomodoro-style timer with **preset durations** (15, 25, 45, 60 minutes). Features a beautiful **circular SVG progress ring** with real-time animation, an orbiting dot indicator, and ambient CSS glow effects that respond to timer state.

### ⚡ Distraction Button
A large, satisfying button you tap whenever you catch yourself losing focus. Includes:
- **CSS ripple animation** on tap for tactile feedback
- **Counter display** that escalates in color (green → yellow → red) as distractions increase
- **Contextual tips** that change based on distraction count
- Only active when the timer is running (enforces honest tracking)

### 📊 Focus Score Algorithm
At the end of each session, FocusMirror calculates a Focus Score using the formula:

```
Focus Score = Focus Time / (Focus Time + Distractions × Penalty) × 100
```

Where:
- **Focus Time** = Total seconds the timer ran
- **Distractions** = Number of times you pressed the distraction button
- **Penalty** = 30 seconds per distraction (configurable)

The score is mapped to a **letter grade** with descriptive labels:

| Score | Grade | Label |
|-------|-------|-------|
| 90–100% | **S** | Legendary Focus |
| 80–89% | **A** | Excellent |
| 70–79% | **B** | Good Job |
| 60–69% | **C** | Decent |
| 0–59% | **D** | Keep Trying |

### 📈 Analytics Dashboard
A full analytics view with **pure CSS charts** (no chart library), including:
- **Sessions per day** — Bar chart showing daily session count
- **Distractions per day** — Bar chart tracking daily distraction totals
- **Focus Score trend** — Dot plot showing score progression over time
- **Summary stats** — Total focus time, session count, average score, best score
- CSS hover tooltips on all chart elements

### 🧠 Smart Insights Engine
FocusMirror generates **pattern-based insights** by analyzing your session data using JavaScript logic — no AI API required. The insight engine detects:

- **Best focus time of day** — _"Your best focus time is around 10 AM (morning)"_
- **Session length impact** — _"You get distracted more in longer sessions"_
- **Improvement trends** — _"Your focus is improving! Recent sessions average 85% vs 72% before"_
- **Distraction patterns** — _"You average 1.2 distractions per session. Incredible discipline!"_
- **Milestone recognition** — _"You've completed 15 focus sessions. You're building a strong habit!"_

The insights are color-coded by type (success, warning, tip, info) and feel like genuine AI recommendations.

### 🔥 Daily Streaks
Tracks consecutive days of focus sessions:
- **Current streak** with escalating fire emojis (🔥, 🔥🔥, 🔥🔥🔥)
- **Best streak** record displayed alongside
- CSS floating animation on the fire emoji

### 🎯 Customizable Goals
Set and track daily goals:
- **Max distractions per session** (default: 3)
- **Minimum focus score** (default: 80%)
- **Session completion** goal (at least 1 per day)
- Goals show ✓/✗ status in real-time with color-coded indicators
- Editable through an inline edit form

### 📋 Session History
A scrollable log of all past sessions showing:
- Date and time of each session
- Duration and distraction count
- Focus score badge with color coding
- Mini CSS progress bar for quick visual scanning
- Last 20 sessions displayed, newest first

### 🌙 Dark Mode Design
The entire app is built with a premium dark theme featuring:
- Deep dark backgrounds with subtle CSS gradients
- Glassmorphism card effects with `backdrop-filter: blur()`
- CSS grid background pattern with radial fade mask
- Smooth CSS micro-animations and transitions on all interactive elements
- Custom-styled scrollbar

---

## 🔧 How It Works

```
┌─────────────────────────────────────────────────┐
│                   USER SESSION                   │
│                                                  │
│  1. Select duration (15/25/45/60 min)            │
│  2. Press "Start Focus"                          │
│  3. Work on your task                            │
│  4. Tap "Distracted!" when you lose focus        │
│  5. Timer completes → Focus Score calculated     │
│  6. Session saved → Analytics & Insights update  │
│                                                  │
│  ┌──────────┐    ┌──────────────┐                │
│  │  Timer   │───▶│  Focus Score  │               │
│  │ Running  │    │  Calculated   │               │
│  └──────────┘    └──────────────┘                │
│       │                 │                        │
│       ▼                 ▼                        │
│  ┌──────────┐    ┌──────────────┐                │
│  │Distraction│   │   Session     │               │
│  │  Counter  │   │   Saved to    │               │
│  │  (live)   │   │  localStorage │               │
│  └──────────┘    └──────────────┘                │
│                         │                        │
│                         ▼                        │
│               ┌──────────────────┐               │
│               │   Analytics &    │               │
│               │   Insights       │               │
│               │   Generated      │               │
│               └──────────────────┘               │
└─────────────────────────────────────────────────┘
```

---

## 💾 Data Model

All data is stored in the browser's `localStorage` — **no backend, no accounts, no cloud**. Your data stays on your device.

### Session Object
```json
{
  "id": 1714281234567,
  "date": "2026-04-28T06:54:00.000Z",
  "focusTime": 1500,
  "distractions": 3,
  "focusScore": 77
}
```

### Goals Object
```json
{
  "maxDistractions": 3,
  "minFocusScore": 80
}
```

### Streak Object
```json
{
  "current": 5,
  "best": 12,
  "lastDate": "Mon Apr 28 2026"
}
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Setup

```bash
# Clone the repository
git clone https://github.com/singhshouryat2-maker/-Capstone-Project-Focus-Mirror.git
cd -Capstone-Project-Focus-Mirror

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

The optimized output will be in the `dist/` folder, ready to deploy on any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

---

## 🏗 Architecture

```
src/
├── main.jsx                    # React entry point
├── index.css                   # Global design system & CSS custom properties
├── App.jsx                     # Main app — state management & layout
├── App.css                     # App layout, header, CSS background effects
│
├── components/
│   ├── Timer.jsx               # Focus timer with SVG circular ring
│   ├── Timer.css               # Timer styles & CSS animations
│   ├── DistractionButton.jsx   # Distraction tracker button
│   ├── DistractionButton.css   # Button styles & CSS ripple effect
│   ├── FocusScore.jsx          # Score display with SVG ring & grade
│   ├── FocusScore.css          # Score card styles
│   ├── Analytics.jsx           # Pure CSS bar charts & summary stats
│   ├── Analytics.css           # Chart styles & hover tooltips
│   ├── Insights.jsx            # Smart insight cards
│   ├── Insights.css            # Insight item styles & slide animations
│   ├── SessionHistory.jsx      # Past session list
│   ├── SessionHistory.css      # History list styles
│   ├── StreaksGoals.jsx         # Streaks display & editable goals
│   └── StreaksGoals.css         # Streaks & goals styles
│
├── hooks/
│   └── useTimer.js             # Custom React hook (start/pause/reset logic)
│
└── utils/
    ├── storage.js              # localStorage CRUD & focus score calculation
    └── insights.js             # Pattern-based insight generator (JS logic)
```

### Component Hierarchy

```
App
├── Header (logo + nav tabs)
├── Focus Tab
│   ├── Timer          → SVG ring + JS interval
│   ├── FocusScore     → SVG ring + CSS animations
│   ├── DistractionButton → CSS ripple + React state
│   └── StreaksGoals   → localStorage + React state
└── Analytics Tab
    ├── Analytics      → Pure CSS bar charts
    ├── Insights       → JS pattern matching
    └── SessionHistory → localStorage data list
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **HTML** | Page structure & SVG elements |
| **CSS** | Styling, animations, glassmorphism, responsive layout |
| **JavaScript** | Application logic, data processing, insight algorithms |
| **React 19** | UI component framework & state management |
| **Vite 8** | Build tool & development server |
| **localStorage** | Client-side data persistence |

### Why These Choices?

- **No external chart library** — Charts are built with pure CSS (flexbox bars + absolutely positioned dots). This keeps the bundle small and demonstrates strong CSS proficiency.
- **No backend** — `localStorage` makes the app instantly usable with zero setup. Data stays private on the user's device.
- **No AI API** — The insight engine uses JavaScript statistical pattern matching on local data. This is more impressive than calling ChatGPT because it shows algorithmic thinking and data analysis skills.
- **Vanilla CSS over Tailwind** — Uses CSS custom properties (variables) for a complete design system, demonstrating deep understanding of the CSS cascade, animations, and modern layout techniques.
- **React hooks** — All state is managed with `useState`, `useEffect`, `useCallback`, and a custom `useTimer` hook, showcasing modern React patterns without external state libraries.

---

## 🧪 How the Focus Score Works

The Focus Score algorithm is designed to be simple yet meaningful:

```javascript
Focus Score = (Focus Time) / (Focus Time + Distractions × Penalty) × 100
```

**Example calculations:**

| Session | Focus Time | Distractions | Penalty (30s each) | Score |
|---------|-----------|-------------|-------------------|-------|
| 25 min session, 0 distractions | 1500s | 0 | 0s | **100%** |
| 25 min session, 2 distractions | 1500s | 2 | 60s | **96%** |
| 25 min session, 5 distractions | 1500s | 5 | 150s | **91%** |
| 25 min session, 10 distractions | 1500s | 10 | 300s | **83%** |
| 15 min session, 8 distractions | 900s | 8 | 240s | **79%** |

The penalty factor means that **longer sessions are more forgiving** of occasional distractions, while shorter sessions demand higher concentration — mirroring real-life focus dynamics.

---

## 🧠 How the Insight Engine Works

The insight generator analyzes session history without any AI API. It uses **JavaScript statistical pattern matching**:

1. **Time-of-Day Analysis** — Groups sessions by hour using `Date.getHours()`, finds the hour with highest average score
2. **Session Length Correlation** — Compares distraction rates in long (≥25 min) vs. short (<25 min) sessions using array filtering and averaging
3. **Trend Detection** — Compares the last 3 sessions against the previous 3 using array slicing to detect improvement or decline
4. **Distraction Averaging** — Calculates per-session distraction rates with `Array.reduce()` and provides contextual feedback
5. **Score Classification** — Maps average scores to motivational messages using conditional logic

Each insight is typed (`success`, `warning`, `tip`, `info`) and rendered with appropriate CSS colors and icons.

---

## 📱 Responsive Design

FocusMirror is fully responsive using **CSS Grid** and **media queries**:

| Breakpoint | Layout |
|---|---|
| **Desktop** (>900px) | Two-column CSS grid — timer left, distraction tracker right |
| **Tablet/Mobile** (<900px) | Single-column stacked layout |
| **Small Mobile** (<480px) | Reduced timer ring size and button dimensions |

---

## 🔮 Future Roadmap

- [ ] **Export Data** — Download session history as CSV/JSON
- [ ] **Distraction Categories** — Tag distractions (phone, social media, daydreaming)
- [ ] **Sound Alerts** — Optional audio notifications on timer events
- [ ] **Focus Music Integration** — Built-in ambient sounds during sessions
- [ ] **PWA Support** — Install as a native app on mobile
- [ ] **Weekly Reports** — Summary of focus patterns
- [ ] **Multi-device Sync** — Cloud backup with optional account

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ☕ and focus.**

_Track your distractions. Own your time._

◎ FocusMirror

</div>
