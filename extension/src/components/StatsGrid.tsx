/**
 * StatsGrid — 2×2 dashboard grid showing user bookmark stats.
 */

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Stats } from '../types';

interface StatsGridProps {
  stats: Stats | null;
  loading: boolean;
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  if (loading || !stats) {
    return (
      <div className="h-32 bg-muted rounded-xl border flex items-center justify-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
        Loading Stats...
      </div>
    );
  }

  const data = [
    { name: 'Bookmarks', value: stats.totalBookmarks, fill: '#1d9bf0' },
    { name: 'Favorites', value: stats.favorites, fill: '#ef4444' },
    { name: 'Collections', value: stats.collections, fill: '#f59e0b' },
    { name: 'Tags', value: stats.tags, fill: '#22c55e' },
  ];

  return (
    <div className="bg-white border rounded-xl  p-4 animate-fade-in relative z-10">
      <h3 className="text-xs font-semibold text-muted-foreground capitalize tracking-widest mb-4 px-1">
        Your Activity
      </h3>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: '#536471' }}
              dy={5}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0f1419] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl">
                      {payload[0].payload.name}: <span className="text-primary">{payload[0].value}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
