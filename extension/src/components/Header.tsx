/**
 * Header — sticky top bar with logo, refresh button, and user avatar.
 */

import { RefreshCw } from 'lucide-react';
import { openTab } from '../lib/chrome';
import { API_BASE_URL } from '../lib/constants';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="px-4 py-3 flex items-center justify-between border-b sticky top-0 z-50 bg-transparent">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => openTab(API_BASE_URL)}
      >
        <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-border">
          <img src="/favicon_io/apple-touch-icon.png" alt="MyBookmark Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="font-black text-lg tracking-tight">MyBookmark</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => window.location.reload()}
          title="Refresh extension"
          className="w-8 h-8 rounded-full bg-secondary border flex items-center justify-center hover:bg-secondary/80 transition-all active:rotate-180 duration-300"
        >
          <RefreshCw size={14} className="text-muted-foreground" />
        </button>

        {user && (
          <button
            onClick={() => openTab(API_BASE_URL)}
            className="w-8 h-8 rounded-full border border-border overflow-hidden bg-muted/50 flex items-center justify-center hover:opacity-80 transition-all"
            title={user.name}
          >
            <img
              src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </button>
        )}
      </div>
    </header>
  );
}
