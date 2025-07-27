import React, { useState } from 'react';

interface HeapMapProps {
  loginDates: string[]; // ISO date strings
  daysCount?: number; // Optional: number of days to show (default: 365)
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const HeapMap: React.FC<HeapMapProps> = ({ loginDates, daysCount }) => {
  // Default to 1 year
  const count = daysCount ?? 365;
  const now = new Date();
  // Get last N days
  const days: Date[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d);
  }
  // Group days by week
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  const columns = weeks.length;
  // Month labels
  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, colIdx) => {
    const firstDay = week[0];
    if (firstDay && firstDay.getMonth() !== lastMonth) {
      monthLabels.push({ col: colIdx, label: MONTHS[firstDay.getMonth()] });
      lastMonth = firstDay.getMonth();
    }
  });
  // Tooltip state
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  // Color scale (LeetCode style: 4 levels)
  function getColor(dateStr: string) {
    // For demo, only binary: active/inactive. You can add more levels if you have activity counts.
    return loginDates.includes(dateStr) ? 'bg-green-500' : 'bg-gray-200';
  }
  return (
    <div className="w-full relative">
      {/* Month labels */}
      <div className="flex ml-8 mb-1" style={{ gap: '4px' }}>
        {Array.from({ length: columns }).map((_, colIdx) => {
          const label = monthLabels.find(m => m.col === colIdx)?.label;
          return (
            <div key={colIdx} className="w-6 text-xs text-center text-muted-foreground font-semibold">
              {label || ''}
            </div>
          );
        })}
      </div>
      <div className="flex">
        {/* Weekday labels */}
        <div className="flex flex-col mr-2" style={{ gap: '4px' }}>
          {WEEKDAYS.map((wd, i) => (
            <div key={wd} className="h-6 w-6 text-xs text-muted-foreground text-center font-semibold flex items-center justify-center">
              {wd}
            </div>
          ))}
        </div>
        {/* Heatmap grid */}
        <div
          className="grid"
          style={{ gridAutoFlow: 'row', gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: 'repeat(7, 1fr)', gap: '4px' }}
        >
          {weeks.map((week, colIdx) =>
            week.map((date, rowIdx) => {
              const dateStr = date.toISOString().slice(0, 10);
              return (
                <div
                  key={dateStr}
                  title={dateStr}
                  className={`w-6 h-6 rounded ${getColor(dateStr)} border border-gray-300 cursor-pointer`}
                  style={{ gridColumn: colIdx + 1, gridRow: rowIdx + 1 }}
                  onMouseEnter={e => {
                    setTooltip({
                      x: e.currentTarget.getBoundingClientRect().left + window.scrollX,
                      y: e.currentTarget.getBoundingClientRect().top + window.scrollY - 30,
                      text: `${dateStr}${loginDates.includes(dateStr) ? ': Active' : ': No activity'}`,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })
          )}
        </div>
      </div>
      {/* Color legend */}
      <div className="flex items-center gap-2 mt-2 ml-8">
        <span className="text-xs text-muted-foreground">Less</span>
        <div className="w-6 h-6 rounded bg-gray-200 border border-gray-300" />
        <div className="w-6 h-6 rounded bg-green-500 border border-gray-300" />
        <span className="text-xs text-muted-foreground">More</span>
      </div>
      {/* Tooltip */}
      {tooltip && (
        <div
          style={{ position: 'absolute', left: tooltip.x, top: tooltip.y, zIndex: 10 }}
          className="px-2 py-1 rounded bg-background border border-border text-xs shadow-lg"
        >
          {tooltip.text}
        </div>
      )}
      <div className="mt-2 text-xs text-muted-foreground">LeetCode-style login heatmap</div>
    </div>
  );
};
