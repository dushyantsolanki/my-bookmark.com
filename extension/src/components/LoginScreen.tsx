/**
 * LoginScreen — shown when the user is not authenticated.
 */

import { Globe } from 'lucide-react';
import { openTab } from '../lib/chrome';
import { API_BASE_URL } from '../lib/constants';

export function LoginScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
        <Globe size={32} className="text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black">Authentication Required</h2>
        <p className="text-sm text-muted-foreground">
          Sign in to start saving bookmarks.
        </p>
      </div>
      <button
        onClick={() => openTab(API_BASE_URL)}
        className="std-btn-primary w-full"
      >
        Login to Dashboard
      </button>
    </div>
  );
}
