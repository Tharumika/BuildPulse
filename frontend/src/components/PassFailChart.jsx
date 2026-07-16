import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

function PassFailChart({ events }) {
  const chartData = useMemo(() => {
    if (!events.length) return [];

    const grouped = {};
    events.forEach(event => {
      const date = new Date(event.timestamp).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric',
      });
      if (!grouped[date]) grouped[date] = { date, success: 0, failure: 0 };
      grouped[date][event.status]++;
    });

    return Object.values(grouped).reverse();
  }, [events]);

  if (!chartData.length) {
    return <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
        <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
          }}
        />
        <Legend />
        <Bar dataKey="success" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
        <Bar dataKey="failure" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default PassFailChart;
