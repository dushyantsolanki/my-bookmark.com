/**
 * API client for the MyBookmark backend.
 * All fetch calls go through here.
 */

import { ENDPOINTS } from './constants';
import type { User, Stats } from '../types';

/** Fetch the currently authenticated user */
export async function fetchCurrentUser(token: string): Promise<User | null> {
  try {
    const res = await fetch(ENDPOINTS.AUTH_ME, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return res.json();
    return null;
  } catch {
    return null;
  }
}

/** Fetch dashboard stats for a specific user */
export async function fetchUserStats(userId: string, token: string): Promise<Stats | null> {
  try {
    const res = await fetch(`${ENDPOINTS.BOOKMARKS_STATS}?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return res.json();
    return null;
  } catch {
    return null;
  }
}

/** Save a new bookmark */
export async function addBookmark(
  payload: { url: string; title: string; userId: string },
  token: string,
): Promise<boolean> {
  try {
    const res = await fetch(ENDPOINTS.BOOKMARKS_ADD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
