/**
 * Application-wide constants.
 * Update API_BASE_URL when deploying to production.
 */

export const API_BASE_URL = 'https://my-bookmark-com.vercel.app';

export const ENDPOINTS = {
  AUTH_ME: `${API_BASE_URL}/api/auth/me`,
  BOOKMARKS_ADD: `${API_BASE_URL}/api/bookmarks/add`,
  BOOKMARKS_STATS: `${API_BASE_URL}/api/bookmarks/stats`,
} as const;

export const COOKIE_NAME = 'accessToken';

/** How often (ms) to poll the active tab for changes */
export const TAB_POLL_INTERVAL = 1000;

/** How often (ms) to poll auth state for login/logout detection */
export const AUTH_POLL_INTERVAL = 5000;
