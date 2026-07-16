function validateEvent(payload) {
  if (!payload.project || typeof payload.project !== 'string') {
    return { valid: false, error: 'project is required and must be a string' };
  }

  if (!['success', 'failure'].includes(payload.status)) {
    return { valid: false, error: 'status must be "success" or "failure"' };
  }

  if (typeof payload.durationSeconds !== 'number' || payload.durationSeconds < 0) {
    return { valid: false, error: 'durationSeconds must be a non-negative number' };
  }

  return { valid: true, error: null };
}

function getPassRate(events) {
  if (!events.length) return 0;
  const passed = events.filter(e => e.status === 'success').length;
  return Math.round((passed / events.length) * 1000) / 10;
}

function computeSummary(events) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const deploysThisWeek = events.filter(e => new Date(e.timestamp) >= oneWeekAgo).length;

  const avgDurationSeconds = events.length
    ? Math.round(events.reduce((sum, e) => sum + e.durationSeconds, 0) / events.length)
    : 0;

  // count consecutive failures from most recent
  let failureStreak = 0;
  const sorted = [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  for (const e of sorted) {
    if (e.status === 'failure') failureStreak++;
    else break;
  }

  return {
    totalBuilds: events.length,
    passRate: getPassRate(events),
    avgDurationSeconds,
    deploysThisWeek,
    failureStreak,
  };
}

module.exports = { validateEvent, getPassRate, computeSummary };
