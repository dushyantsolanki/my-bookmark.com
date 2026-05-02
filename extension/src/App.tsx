import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from './hooks/useAuth';
import { useActiveTab } from './hooks/useActiveTab';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginScreen } from './components/LoginScreen';
import { StatsGrid } from './components/StatsGrid';
import { BookmarkForm } from './components/BookmarkForm';
import type { StatusMessage } from './types';

function App() {
  const { user, stats, loading, refreshStats } = useAuth();
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const tab = useActiveTab();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-transparent text-[#0f1419] font-sans relative">
      <Header user={user} />

      {/* Global Status Notification - Appears under header */}
      {status && (
        <div
          className={`absolute top-[52px] left-0 right-0 z-10 animate-slide-down border-b shadow-sm py-2.5 px-4 flex items-center justify-center gap-2 text-[11px] font-bold transition-all ${status.type === 'success'
              ? 'bg-[#e8f5fd] text-[#1d9bf0] border-[#1d9bf020]'
              : 'bg-[#fff5f5] text-[#e02424] border-[#e0242420]'
            }`}
        >
          {status.type === 'error' && <AlertCircle size={14} />}
          {status.type === 'success' && <CheckCircle2 size={14} />}
          {status.message}
          <button
            onClick={() => setStatus(null)}
            className="absolute right-3 opacity-50 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-4 py-5">
        {!user ? (
          <LoginScreen />
        ) : (
          <div className="space-y-5 animate-fade-in">
            <StatsGrid stats={stats} loading={false} />
            <BookmarkForm
              user={user}
              tab={tab}
              onSaved={refreshStats}
              status={status}
              onStatusChange={setStatus}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
