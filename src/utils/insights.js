export function generateInsights(sessions) {
  if (sessions.length < 2) {
    return [
      { icon: '🎯', text: 'Complete a few sessions to unlock personalized insights!', type: 'info' },
    ];
  }

  const insights = [];
  const totalSessions = sessions.length;
  const totalDistractions = sessions.reduce((sum, s) => sum + s.distractions, 0);
  const avgDistractions = totalDistractions / totalSessions;
  const avgFocusScore = sessions.reduce((sum, s) => sum + s.focusScore, 0) / totalSessions;

  // Time-of-day analysis
  const hourBuckets = {};
  sessions.forEach(s => {
    const hour = new Date(s.date).getHours();
    if (!hourBuckets[hour]) hourBuckets[hour] = { scores: [], count: 0 };
    hourBuckets[hour].scores.push(s.focusScore);
    hourBuckets[hour].count++;
  });

  let bestHour = null;
  let bestAvgScore = 0;
  Object.entries(hourBuckets).forEach(([hour, data]) => {
    const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
    if (avg > bestAvgScore) {
      bestAvgScore = avg;
      bestHour = parseInt(hour);
    }
  });

  if (bestHour !== null) {
    const period = bestHour < 12 ? 'morning' : bestHour < 17 ? 'afternoon' : 'evening';
    const timeStr = bestHour <= 12 ? `${bestHour || 12} AM` : `${bestHour - 12} PM`;
    insights.push({
      icon: '⏰',
      text: `Your best focus time is around ${timeStr} (${period}). Try to schedule important work then!`,
      type: 'tip',
    });
  }

  // Distraction pattern
  const longSessions = sessions.filter(s => s.focusTime >= 1500); // 25+ min
  const shortSessions = sessions.filter(s => s.focusTime < 1500);
  if (longSessions.length > 0 && shortSessions.length > 0) {
    const longAvgDist = longSessions.reduce((s, x) => s + x.distractions, 0) / longSessions.length;
    const shortAvgDist = shortSessions.reduce((s, x) => s + x.distractions, 0) / shortSessions.length;
    if (longAvgDist > shortAvgDist * 1.5) {
      insights.push({
        icon: '⚡',
        text: 'You get distracted more in longer sessions. Try breaking them into shorter 15-min blocks.',
        type: 'warning',
      });
    }
  }

  // Improvement trend
  if (sessions.length >= 3) {
    const recent = sessions.slice(-3);
    const older = sessions.slice(-6, -3);
    if (older.length >= 3) {
      const recentAvg = recent.reduce((s, x) => s + x.focusScore, 0) / recent.length;
      const olderAvg = older.reduce((s, x) => s + x.focusScore, 0) / older.length;
      if (recentAvg > olderAvg + 5) {
        insights.push({
          icon: '📈',
          text: `Your focus is improving! Recent sessions average ${Math.round(recentAvg)}% vs ${Math.round(olderAvg)}% before.`,
          type: 'success',
        });
      } else if (recentAvg < olderAvg - 5) {
        insights.push({
          icon: '📉',
          text: `Your focus dipped recently. Take a break and try again when refreshed.`,
          type: 'warning',
        });
      }
    }
  }

  // Average distraction insight
  if (avgDistractions < 2) {
    insights.push({
      icon: '🌟',
      text: `Incredible discipline! You average only ${avgDistractions.toFixed(1)} distractions per session.`,
      type: 'success',
    });
  } else if (avgDistractions > 5) {
    insights.push({
      icon: '🔔',
      text: `You average ${avgDistractions.toFixed(1)} distractions per session. Try removing your phone during focus time.`,
      type: 'warning',
    });
  }

  // Score insight
  if (avgFocusScore >= 85) {
    insights.push({
      icon: '🏆',
      text: `Your average focus score is ${Math.round(avgFocusScore)}%. You're in the zone!`,
      type: 'success',
    });
  } else if (avgFocusScore < 60) {
    insights.push({
      icon: '💪',
      text: `Your average focus score is ${Math.round(avgFocusScore)}%. Small improvements add up—keep going!`,
      type: 'info',
    });
  }

  // Session count
  insights.push({
    icon: '📊',
    text: `You've completed ${totalSessions} focus sessions. ${totalSessions >= 10 ? 'You\'re building a strong habit!' : 'Keep it up!'}`,
    type: 'info',
  });

  return insights.slice(0, 4); // Max 4 insights
}
