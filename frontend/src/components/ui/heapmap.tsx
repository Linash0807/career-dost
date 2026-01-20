import React, { useState } from 'react';

interface HeapMapProps {
  loginDates: string[]; // ISO date strings
  daysCount?: number; // Optional: number of days to show (default: 365)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const HeapMap: React.FC<HeapMapProps> = ({ loginDates, daysCount }) => {
  const count = daysCount ?? 183;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Align start to the preceding Sunday
  const start = new Date(now);
  start.setDate(now.getDate() - count + 1);
  const firstSunday = new Date(start);
  firstSunday.setDate(start.getDate() - start.getDay());

  // Generate all days
  const days: Date[] = [];
  const curr = new Date(firstSunday);
  while (curr <= now) {
    days.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }

  // Group into weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; active: boolean } | null>(null);

  const isToday = (date: Date) => {
    return date.toDateString() === now.toDateString();
  };

  const hasActivity = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const dateStr = d.toISOString().split('T')[0];
    return loginDates.includes(dateStr);
  };

  return (
    <div className="w-full flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl">
      <div className="w-full overflow-x-auto custom-scrollbar pb-4 pt-8">
        <div className="inline-flex flex-col min-w-full">

          {/* Month Labels */}
          <div className="flex ml-12 mb-3 h-5 relative">
            {weeks.map((week, i) => {
              const firstDay = week[0];
              if (firstDay.getDate() <= 7 || i === 0) {
                return (
                  <div
                    key={i}
                    className="absolute text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter"
                    style={{ left: `${i * (20 + 4)}px` }}
                  >
                    {MONTHS[firstDay.getMonth()]}
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="flex gap-4">
            {/* Weekday Labels */}
            <div className="flex flex-col justify-between py-1 h-[164px] w-8 shrink-0">
              {WEEKDAYS.map((day, i) => (
                <div key={i} className="h-4 text-[11px] font-bold text-gray-300 dark:text-gray-600 flex items-center justify-end pr-1">
                  {i % 2 === 0 ? day.substring(0, 1) : ''}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[4px]">
              {weeks.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[4px] shrink-0">
                  {week.map((date, rowIdx) => {
                    if (date > now) return <div key={rowIdx} className="w-5 h-5 bg-transparent" />;

                    const active = hasActivity(date);
                    const today = isToday(date);

                    return (
                      <div
                        key={rowIdx}
                        className={`w-5 h-5 rounded-[4px] transition-all duration-200 cursor-pointer shadow-sm
                          ${active
                            ? 'bg-green-500 hover:bg-green-400 hover:scale-110 shadow-green-200 dark:shadow-green-900/20'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}
                          ${today ? 'ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-900 scale-105' : ''}
                        `}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            x: rect.left + window.scrollX,
                            y: rect.top + window.scrollY - 60,
                            date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
                            active: active
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-4 py-2 rounded-xl bg-gray-900 text-white text-[11px] shadow-2xl pointer-events-none -translate-x-1/2 flex flex-col items-center border border-gray-800 backdrop-blur-md bg-opacity-90"
          style={{ left: tooltip.x + 10, top: tooltip.y }}
        >
          <span className="font-extrabold text-blue-300 mb-0.5">{tooltip.date}</span>
          <span className={`font-medium ${tooltip.active ? 'text-green-400' : 'text-gray-400'}`}>
            {tooltip.active ? 'Goal Completed' : 'No Activity'}
          </span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-900" />
        </div>
      )}

      {/* Legend */}
      <div className="w-full flex items-center justify-between mt-8 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[2px] bg-green-500" />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[2px] bg-gray-200 dark:bg-gray-700" />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[2px] ring-1 ring-blue-400 bg-gray-100 dark:bg-gray-800" />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Today</span>
          </div>
        </div>
        <span className="text-[10px] font-medium text-gray-400 italic">Tracking since {start.toLocaleDateString()}</span>
      </div>
    </div>
  );
};
