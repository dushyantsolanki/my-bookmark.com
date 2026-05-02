import { ENDPOINTS } from './constants';
import type { User, Stats } from '../types';

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch(ENDPOINTS.AUTH_ME, {
      credentials: 'include',
    });
    if (res.ok) return res.json();
    return null;
  } catch {
    return null;
  }
}

export async function fetchUserStats(): Promise<Stats | null> {
  try {
    const res = await fetch(ENDPOINTS.BOOKMARKS_STATS, {
      credentials: 'include',
    });
    if (res.ok) return res.json();
    return null;
  } catch {
    return null;
  }
}

export async function addBookmark(
  payload: { url: string; title: string; collectionId?: string; tags?: string[] },
): Promise<boolean> {
  try {
    const res = await fetch(ENDPOINTS.BOOKMARKS_ADD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchCollections(): Promise<any[]> {
  try {
    const res = await fetch(ENDPOINTS.COLLECTIONS, {
      credentials: 'include',
    });
    if (res.ok) return res.json();
    return [];
  } catch {
    return [];
  }
}

export async function createCollection(
  payload: { name: string; icon?: string; color?: string },
): Promise<any | null> {
  try {
    const res = await fetch(ENDPOINTS.COLLECTIONS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    if (res.ok) return res.json();
    return null;
  } catch {
    return null;
  }
}

export async function fetchTags(): Promise<any[]> {
  try {
    const res = await fetch(ENDPOINTS.TAGS, {
      credentials: 'include',
    });
    if (res.ok) return res.json();
    return [];
  } catch {
    return [];
  }
}

export async function createTag(
  payload: { name: string; color?: string },
): Promise<any | null> {
  try {
    const res = await fetch(ENDPOINTS.TAGS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    if (res.ok) return res.json();
    return null;
  } catch {
    return null;
  }
}
