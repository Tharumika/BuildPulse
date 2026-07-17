function SummaryCards({ summary }) {
  if (!summary) return null;

  const passRateColor = summary.passRate >= 80
    ? 'var(--accent-green)'
    : summary.passRate >= 60
      ? 'var(--accent-yellow)'
      : 'var(--accent-red)';

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const cards = [
    {
      label: 'Total Builds',
      value: summary.totalBuilds,
      icon: '📦',
      accent: 'var(--accent-indigo)',
    },
    {
      label: 'Pass Rate',
      value: `${summary.passRate}%`,
      icon: '✅',
      accent: passRateColor,
    },
    {
      label: 'Avg Duration',
      value: formatDuration(summary.avgDurationSeconds),
      icon: '⏱',
      accent: 'var(--accent-cyan)',
    },
    {
      label: 'Deploys This Week',
      value: summary.deploysThisWeek,
      icon: '🚀',
      accent: 'var(--accent-green)',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map(card => (
        <div
          key={card.label}
          className="summary-card"
          style={{ '--card-accent': card.accent }}
        >
          <span className="card-icon">{card.icon}</span>
          <div className="card-label">{card.label}</div>
          <div className="card-value" style={{ color: card.accent }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
