import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { designs } from '../data/designs';
import './CalendarPage.css';

const DROP_CYCLE_COLORS = {
  "1":  "#ef4444",
  "2":  "#f97316",
  "3":  "#f59e0b",
  "4":  "#eab308",
  "5":  "#84cc16",
  "6":  "#22c55e",
  "7":  "#10b981",
  "8":  "#14b8a6",
  "9":  "#06b6d4",
  "10": "#0ea5e9",
  "11": "#3b82f6",
  "12": "#6366f1",
  "13": "#8b5cf6",
  "14": "#a855f7",
  "15": "#d946ef",
  "16": "#ec4899",
  "17": "#f43f5e",
  "18": "#64748b",
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_ABBRS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function daysBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CalendarPage() {
  const dateMap = useMemo(() => {
    const map = {};
    for (const d of designs) {
      if (d.release_date) {
        if (!map[d.release_date]) map[d.release_date] = [];
        map[d.release_date].push(d);
      }
    }
    return map;
  }, []);

  // Per-cycle start/end dates
  const cycleRanges = useMemo(() => {
    const ranges = {};
    for (const d of designs) {
      if (!d.release_date || !d.drop_cycle) continue;
      if (!ranges[d.drop_cycle]) {
        ranges[d.drop_cycle] = { start: d.release_date, end: d.release_date };
      } else {
        if (d.release_date < ranges[d.drop_cycle].start) ranges[d.drop_cycle].start = d.release_date;
        if (d.release_date > ranges[d.drop_cycle].end)   ranges[d.drop_cycle].end   = d.release_date;
      }
    }
    return ranges;
  }, []);

  // windowMap: dateStr → cycle (every day within a cycle's start–end window)
  // gapSet: dateStr that falls between consecutive cycles
  const { windowMap, gapSet, gapPeriods } = useMemo(() => {
    const sortedCycles = Object.entries(cycleRanges)
      .sort((a, b) => a[1].start.localeCompare(b[1].start));

    const wMap = {};
    for (const [cycle, { start, end }] of sortedCycles) {
      let cur = start;
      while (cur <= end) {
        wMap[cur] = cycle;
        cur = addDays(cur, 1);
      }
    }

    const gSet = new Set();
    const gaps = [];
    for (let i = 0; i < sortedCycles.length - 1; i++) {
      const [prevCycle, { end: prevEnd }] = sortedCycles[i];
      const [nextCycle, { start: nextStart }] = sortedCycles[i + 1];
      const days = daysBetween(prevEnd, nextStart) - 1;
      if (days > 0) {
        let cur = addDays(prevEnd, 1);
        while (cur < nextStart) {
          gSet.add(cur);
          cur = addDays(cur, 1);
        }
        gaps.push({ fromCycle: prevCycle, toCycle: nextCycle, start: addDays(prevEnd, 1), end: addDays(nextStart, -1), days });
      }
    }

    return { windowMap: wMap, gapSet: gSet, gapPeriods: gaps };
  }, [cycleRanges]);

  // Sorted cycles for timeline
  const sortedCycles = useMemo(() =>
    Object.entries(cycleRanges).sort((a, b) => a[1].start.localeCompare(b[1].start)),
  [cycleRanges]);

  const { startYear, startMonth, endYear, endMonth } = useMemo(() => {
    const dates = Object.keys(dateMap).sort();
    if (!dates.length) return { startYear: 2023, startMonth: 11, endYear: 2026, endMonth: 5 };
    const first = new Date(dates[0] + 'T00:00:00');
    const last  = new Date(dates[dates.length - 1] + 'T00:00:00');
    return { startYear: first.getFullYear(), startMonth: first.getMonth(), endYear: last.getFullYear(), endMonth: last.getMonth() };
  }, [dateMap]);

  const months = useMemo(() => {
    const result = [];
    let y = startYear, m = startMonth;
    while (y < endYear || (y === endYear && m <= endMonth)) {
      result.push({ year: y, month: m });
      if (++m > 11) { m = 0; y++; }
    }
    return result;
  }, [startYear, startMonth, endYear, endMonth]);

  const dropCycles = useMemo(() =>
    Array.from(new Set(designs.map(d => d.drop_cycle).filter(Boolean)))
      .sort((a, b) => parseInt(a) - parseInt(b)),
  []);

  const years = useMemo(() => [...new Set(months.map(m => m.year))], [months]);

  return (
    <div className="calendar-page">
      <div className="calendar-container">
        <div className="calendar-header">
          <Link to="/" className="calendar-back-btn">← Designs</Link>
          <h2>Drop Calendar</h2>
          <p>{designs.filter(d => d.release_date).length} designs across {dropCycles.length} drop cycles</p>
        </div>

        <div className="calendar-legend">
          {dropCycles.map(cycle => (
            <div key={cycle} className="legend-item">
              <span className="legend-swatch" style={{ background: DROP_CYCLE_COLORS[cycle] }} />
              <span className="legend-label">Cycle {cycle}</span>
            </div>
          ))}
          <div className="legend-item">
            <span className="legend-swatch legend-swatch--gap" />
            <span className="legend-label">Gap</span>
          </div>
        </div>

        {/* Proportional timeline bar */}
        <CycleTimeline sortedCycles={sortedCycles} gapPeriods={gapPeriods} />

        {/* Gap summary table */}
        {gapPeriods.length > 0 && (
          <div className="gap-summary">
            <h4 className="gap-summary-title">Gaps Between Cycles</h4>
            <div className="gap-table">
              {gapPeriods.map((g, i) => (
                <div key={i} className="gap-row">
                  <span
                    className="gap-row-from"
                    style={{ background: DROP_CYCLE_COLORS[g.fromCycle] }}
                  >
                    Cycle {g.fromCycle}
                  </span>
                  <span className="gap-row-arrow">→</span>
                  <span
                    className="gap-row-to"
                    style={{ background: DROP_CYCLE_COLORS[g.toCycle] }}
                  >
                    Cycle {g.toCycle}
                  </span>
                  <span className="gap-row-days">{g.days} day{g.days !== 1 ? 's' : ''}</span>
                  <span className="gap-row-range">{formatDate(g.start)} – {formatDate(g.end)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="calendar-body">
          {years.map(year => (
            <div key={year} className="calendar-year-section">
              <h3 className="year-heading">{year}</h3>
              <div className="months-grid">
                {months.filter(m => m.year === year).map(({ year: y, month: mo }) => (
                  <MonthGrid
                    key={`${y}-${mo}`}
                    year={y}
                    month={mo}
                    dateMap={dateMap}
                    windowMap={windowMap}
                    gapSet={gapSet}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CycleTimeline({ sortedCycles, gapPeriods }) {
  if (!sortedCycles.length) return null;

  const overallStart = sortedCycles[0][1].start;
  const overallEnd   = sortedCycles[sortedCycles.length - 1][1].end;
  const totalDays    = daysBetween(overallStart, overallEnd) + 1;

  // Build interleaved segments: cycle, gap, cycle, gap, ...
  const segments = [];
  for (let i = 0; i < sortedCycles.length; i++) {
    const [cycle, { start, end }] = sortedCycles[i];
    const cycleDays = daysBetween(start, end) + 1;
    const pct = (cycleDays / totalDays) * 100;
    segments.push({ type: 'cycle', cycle, start, end, days: cycleDays, pct });

    if (i < sortedCycles.length - 1) {
      const nextStart = sortedCycles[i + 1][1].start;
      const gapDays = daysBetween(end, nextStart) - 1;
      if (gapDays > 0) {
        const gPct = (gapDays / totalDays) * 100;
        segments.push({ type: 'gap', days: gapDays, pct: gPct });
      }
    }
  }

  return (
    <div className="cycle-timeline">
      <div className="timeline-label-row">
        <span className="timeline-label-text">Cycle timeline — to scale</span>
        <span className="timeline-label-span">{totalDays} days total</span>
      </div>
      <div className="timeline-bar">
        {segments.map((seg, i) =>
          seg.type === 'cycle' ? (
            <div
              key={i}
              className="timeline-cycle"
              style={{ width: `${seg.pct}%`, background: DROP_CYCLE_COLORS[seg.cycle] }}
              title={`Cycle ${seg.cycle}: ${formatDate(seg.start)} → ${formatDate(seg.end)} (${seg.days} days)`}
            >
              {seg.pct >= 2.5 && <span className="timeline-cycle-label">{seg.cycle}</span>}
            </div>
          ) : (
            <div
              key={i}
              className="timeline-gap-seg"
              style={{ width: `${seg.pct}%` }}
              title={`Gap: ${seg.days} days`}
            >
              {seg.pct >= 3 && <span className="timeline-gap-seg-label">{seg.days}d</span>}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function MonthGrid({ year, month, dateMap, windowMap, gapSet }) {
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="month-card">
      <div className="month-title">{MONTH_NAMES[month]}</div>
      <div className="month-grid">
        {DAY_ABBRS.map(a => <span key={a} className="day-header">{a}</span>)}
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} className="day-cell day-empty" />;

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const drops = dateMap[dateStr];

          // Drop day
          if (drops) {
            const cycle = drops[0].drop_cycle;
            const color = DROP_CYCLE_COLORS[cycle] || '#888';
            const tooltip = drops.map(d => `${d.design_name} (Cycle ${d.drop_cycle})`).join('\n');
            if (drops.length === 1) {
              return (
                <Link key={dateStr} to={`/design/${drops[0].index}`}
                  className="day-cell day-drop" style={{ '--drop-color': color }} title={tooltip}>
                  {day}
                </Link>
              );
            }
            return (
              <span key={dateStr} className="day-cell day-drop day-multi"
                style={{ '--drop-color': color }} title={tooltip}>
                {day}
                <span className="multi-badge">{drops.length}</span>
              </span>
            );
          }

          // Gap day
          if (gapSet.has(dateStr)) {
            return <span key={dateStr} className="day-cell day-gap">{day}</span>;
          }

          // Within a cycle window (no drop, but active cycle period)
          const windowCycle = windowMap[dateStr];
          if (windowCycle) {
            const color = DROP_CYCLE_COLORS[windowCycle] || '#888';
            return (
              <span key={dateStr} className="day-cell day-window"
                style={{ '--window-color': color }}>
                {day}
              </span>
            );
          }

          // Outside all cycles
          return <span key={dateStr} className="day-cell day-no-drop">{day}</span>;
        })}
      </div>
    </div>
  );
}
