import { useState, useEffect, useRef, useCallback } from 'react';
import { AUTH_POLL_INTERVAL } from '../lib/constants';
import { getAccessToken } from '../lib/chrome';
import { fetchCurrentUser, fetchUserStats } from '../lib/api';
import type { User, Stats } from '../types';

interface AuthState {
  user: User | null;
  stats: Stats | null;
  loading: boolean;
  token: string;
  refreshStats: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const tokenRef = useRef('');

  const loadStats = useCallback(async (userId: string, token: string) => {
    const data = await fetchUserStats(userId, token);
    if (data) setStats(data);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = await getAccessToken();

    if (token) {
      tokenRef.current = token;
      const userData = await fetchCurrentUser(token);

      if (userData) {
        setUser(userData);
        loadStats(userData.id, token);
      } else {
        setUser(null);
        setStats(null);
      }
    } else {
      setUser(null);
      setStats(null);
    }

    setLoading(false);
  }, [loadStats]);

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, AUTH_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [checkAuth]);

  const refreshStats = useCallback(() => {
    if (user && tokenRef.current) {
      loadStats(user.id, tokenRef.current);
    }
  }, [user, loadStats]);

  return {
    user,
    stats,
    loading,
    token: tokenRef.current,
    refreshStats,
  };
}
