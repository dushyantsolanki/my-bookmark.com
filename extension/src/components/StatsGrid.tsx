/**
 * StatsGrid — 2×2 dashboard grid showing user bookmark stats.
 * Removed charting library for performance and bundle size.
 */

import { Bookmark, Heart, Folder, Tag, Loader2 } from 'lucide-react';
import type { Stats } from '../types';

interface StatsGridProps {
  stats: Stats | null;
  loading: boolean;
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  if (loading || !stats) {
    return (
      <div className="h-32 bg-[#f7f9f9] rounded-xl border border-[#eff3f4] flex items-center justify-center text-xs font-bold text-[#536471] uppercase tracking-widest">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  const items = [
    { label: 'Bookmarks', value: stats.totalBookmarks, icon: Bookmark, color: '#1d9bf0', bg: '#e8f5fd' },
    { label: 'Favorites', value: stats.favorites, icon: Heart, color: '#f91880', bg: '#fee7f2' },
    { label: 'Collections', value: stats.collections, icon: Folder, color: '#ffd400', bg: '#fff9e1' },
    { label: 'Tags', value: stats.tags, icon: Tag, color: '#00ba7c', bg: '#e6f8f2' },
  ];

  return (

    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-[#eff3f4]"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: item.bg }}
          >
            <item.icon size={18} style={{ color: item.color }} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold  text-[#0f1419] leading-tight">
              {item.value.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#536471] truncate">
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>

  );
}
