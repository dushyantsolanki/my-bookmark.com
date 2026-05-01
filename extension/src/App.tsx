/**
 * App — root component.
 *
 * This file is intentionally thin. It composes hooks and components
 * together and handles top-level layout. All business logic lives
 * in hooks (useAuth, useActiveTab) and all UI in components.
 */

import { Loader2 } from 'lucide-react';

import { useAuth } from './hooks/useAuth';
import { useActiveTab } from './hooks/useActiveTab';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginScreen } from './components/LoginScreen';
import { StatsGrid } from './components/StatsGrid';
import { BookmarkForm } from './components/BookmarkForm';

function App() {
  const { user, stats, loading, refreshStats } = useAuth();
  const tab = useActiveTab();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-transparent text-[#0f1419] font-sans">
      <Header user={user} />

      <main className="flex-1 overflow-y-auto px-4 py-5">
        {!user ? (
          <LoginScreen />
        ) : (
          <div className="space-y-5 animate-fade-in">
            <StatsGrid stats={stats} loading={false} />
            <BookmarkForm user={user} tab={tab} onSaved={refreshStats} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
