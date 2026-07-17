import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function DurationChart({ events }) {
  const chartData = useMemo(() => {
    if (!events.length) return [];

    return [...events]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(event => ({
        date: new Date(event.timestamp).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric',
        }),
        duration: event.durationSeconds,
        project: event.project,
      }));
  }, [events]);

  if (!chartData.length) {
    return <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
        <YAxis
          stroke="var(--text-muted)"
          fontSize={12}
          label={{ value: 'seconds', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-muted)' } }}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
          }}
          formatter={(value) => [`${value}s`, 'Duration']}
        />
        <Line
          type="monotone"
          dataKey="duration"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 4, fill: '#6366f1' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default DurationChart;
