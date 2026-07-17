const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api/events';

export async function fetchEvents(project = '') {
  const params = new URLSearchParams();
  if (project) params.set('project', project);
  const res = await fetch(`${API_BASE}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function fetchSummary(project = '') {
  const params = new URLSearchParams();
  if (project) params.set('project', project);
  const res = await fetch(`${API_BASE}/summary?${params}`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}
