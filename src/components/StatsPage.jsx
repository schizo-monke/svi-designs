import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getValueCounts } from '../data/designs';
import './StatsPage.css';

const CHART_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#e11d48', '#a855f7', '#22c55e', '#eab308',
  '#0ea5e9', '#d946ef', '#64748b', '#dc2626', '#059669',
];

const FIELDS = [
  { key: 'barrel_length', label: 'Barrel Length' },
  { key: 'barrel_type', label: 'Barrel Type' },
  { key: 'frame_material', label: 'Frame Material' },
  { key: 'grip_texture', label: 'Grip Texture' },
  { key: 'grip_length', label: 'Grip Length' },
  { key: 'trigger_guard', label: 'Trigger Guard' },
  { key: 'slide_serrations', label: 'Slide Serrations' },
  { key: 'full_slide_serrations', label: 'Full Slide Serrations' },
  { key: 'slide_engraving', label: 'Slide Engraving' },
  { key: 'rollmark_font', label: 'Rollmark Font' },
  { key: 'dust_cover_cut', label: 'Dust Cover Cut' },
  { key: 'compensator', label: 'Compensator' },
  { key: 'cheekbuster', label: 'Cheekbuster' },
  { key: 'irons_dot', label: 'Irons / Dot' },
  { key: 'tumbled_grip', label: 'Tumbled Grip' },
  { key: 'blast_pattern', label: 'Blast Pattern' },
];

const BarChart = ({ data, title }) => {
  const [hovered, setHovered] = useState(null);

  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return null;

  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="bar-chart-card">
      <h3 className="bar-chart-title">{title}</h3>
      <div className="bar-chart-body">
        {data.map((item, i) => {
          const pct = ((item.count / total) * 100).toFixed(1);
          const barWidth = (item.count / maxCount) * 100;
          const color = CHART_COLORS[i % CHART_COLORS.length];
          const isHovered = hovered === i;

          return (
            <div
              key={i}
              className={`bar-row${isHovered ? ' bar-row--active' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="bar-label" title={item.label}>{item.label}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${barWidth}%`, background: color }}
                />
              </div>
              <span className="bar-stats">
                <span className="bar-count">{item.count}</span>
                <span className="bar-pct">{pct}%</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatsPage = () => {
  const charts = useMemo(() => {
    return FIELDS.map(({ key, label }) => {
      const counts = getValueCounts(key);
      const data = Object.entries(counts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);
      return { key, label, data, total: data.reduce((s, d) => s + d.count, 0) };
    });
  }, []);

  return (
    <div className="stats-page">
      <div className="stats-container">
        <div className="stats-header">
          <Link to="/" className="stats-back-btn">← Back to Designs</Link>
          <h2>Design Component Statistics</h2>
          <p>Distribution of values across all {charts[0]?.total ?? 0} catalogued designs</p>
        </div>

        <div className="charts-grid">
          {charts.map(({ key, label, data }) => (
            <BarChart key={key} data={data} title={label} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
