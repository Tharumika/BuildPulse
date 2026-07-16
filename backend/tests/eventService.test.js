const { validateEvent, getPassRate, computeSummary } = require('../src/services/eventService');

describe('validateEvent', () => {
  test('accepts valid payload', () => {
    const result = validateEvent({
      project: 'api-gateway',
      status: 'success',
      durationSeconds: 120,
    });
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  test('rejects missing project', () => {
    const result = validateEvent({ status: 'success', durationSeconds: 120 });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/project/i);
  });

  test('rejects invalid status', () => {
    const result = validateEvent({
      project: 'api-gateway',
      status: 'pending',
      durationSeconds: 120,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/status/i);
  });

  test('rejects negative durationSeconds', () => {
    const result = validateEvent({
      project: 'api-gateway',
      status: 'success',
      durationSeconds: -5,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/durationSeconds/i);
  });
});

describe('getPassRate', () => {
  test('returns 0 for empty array', () => {
    expect(getPassRate([])).toBe(0);
  });

  test('returns 100 for all successes', () => {
    const events = [
      { status: 'success' },
      { status: 'success' },
      { status: 'success' },
    ];
    expect(getPassRate(events)).toBe(100);
  });

  test('returns correct percentage for mixed results', () => {
    const events = [
      { status: 'success' },
      { status: 'failure' },
      { status: 'success' },
      { status: 'failure' },
    ];
    expect(getPassRate(events)).toBe(50);
  });
});

describe('computeSummary', () => {
  test('returns correct deploysThisWeek count', () => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

    const events = [
      { status: 'success', durationSeconds: 100, timestamp: now },
      { status: 'success', durationSeconds: 200, timestamp: threeDaysAgo },
      { status: 'failure', durationSeconds: 150, timestamp: tenDaysAgo },
    ];

    const summary = computeSummary(events);
    expect(summary.deploysThisWeek).toBe(2);
    expect(summary.totalBuilds).toBe(3);
  });
});
