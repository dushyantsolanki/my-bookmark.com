import { ENDPOINTS } from './constants';
import type { User, Stats } from '../types';

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

export async function addBookmark(
  payload: { url: string; title: string; userId: string; collectionId?: string; tags?: string[] },
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

export async function fetchCollections(userId: string, token: string): Promise<any[]> {
  try {
    const res = await fetch(`${ENDPOINTS.COLLECTIONS}?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return res.json();
    return [];
  } catch {
    return [];
  }
}

export async function createCollection(
  payload: { name: string; userId: string; icon?: string; color?: string },
  token: string,
): Promise<any | null> {
  try {
    const res = await fetch(ENDPOINTS.COLLECTIONS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) return res.json();
    return null;
  } catch {
    return null;
  }
}

export async function fetchTags(userId: string, token: string): Promise<any[]> {
  try {
    const res = await fetch(`${ENDPOINTS.TAGS}?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return res.json();
    return [];
  } catch {
    return [];
  }
}

export async function createTag(
  payload: { name: string; userId: string; color?: string },
  token: string,
): Promise<any | null> {
  try {
    const res = await fetch(ENDPOINTS.TAGS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) return res.json();
    return null;
  } catch {
    return null;
  }
}

