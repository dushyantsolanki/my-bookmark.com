export const API_BASE_URL = 'https://my-bookmark-com.vercel.app';
// export const API_BASE_URL = "http://localhost:3000";


export const ENDPOINTS = {
  AUTH_ME: `${API_BASE_URL}/api/auth/me`,
  BOOKMARKS_ADD: `${API_BASE_URL}/api/bookmarks/add`,
  BOOKMARKS_STATS: `${API_BASE_URL}/api/bookmarks/stats`,
  COLLECTIONS: `${API_BASE_URL}/api/collections`,
  TAGS: `${API_BASE_URL}/api/tags`,
} as const;

export const COOKIE_NAME = 'accessToken';
export const TAB_POLL_INTERVAL = 1000;
export const AUTH_POLL_INTERVAL = 3600000;
