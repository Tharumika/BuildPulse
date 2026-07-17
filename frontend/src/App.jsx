import { useState, useEffect, useCallback } from 'react';
import { fetchEvents, fetchSummary } from './api/eventsApi';
import SummaryCards from './components/SummaryCards';
import PassFailChart from './components/PassFailChart';
import DurationChart from './components/DurationChart';
import logoUrl from './assets/BuildPulse.png';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [project, setProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [eventsData, summaryData] = await Promise.all([
        fetchEvents(project),
        fetchSummary(project),
      ]);
      setEvents(eventsData);
      setSummary(summaryData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [project]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const projects = [...new Set(events.map(e => e.project))];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span style={{ color: 'var(--text-muted)' }}>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <img src={logoUrl} alt="BuildPulse Logo" className="header-logo" />
          <h1>Build<span>Pulse</span></h1>
        </div>
        <div className="header-right">
          {lastUpdated && (
            <span className="last-updated">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
            onClick={loadData}
            disabled={refreshing}
          >
            <span className="refresh-icon">↻</span>
            Refresh
          </button>
        </div>
      </header>

      {error && <div className="error-banner">⚠ {error}</div>}

      <div className="filter-bar">
        <select
          className="filter-select"
          value={project}
          onChange={e => setProject(e.target.value)}
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <SummaryCards summary={summary} />

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Pass / Fail Rate</h3>
          <PassFailChart events={events} />
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Build Duration Trend</h3>
          <DurationChart events={events} />
        </div>
      </div>
    </div>
  );
}

export default App;
