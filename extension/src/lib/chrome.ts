/**
 * Thin wrapper around the Chrome extension APIs.
 * Isolates all chrome.* calls so the rest of the app stays testable.
 */

import { API_BASE_URL, COOKIE_NAME } from './constants';

/** Get the access token cookie from the dashboard domain */
export function getAccessToken(): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.cookies) {
      resolve(null);
      return;
    }
    chrome.cookies.get({ url: API_BASE_URL, name: COOKIE_NAME }, (cookie) => {
      resolve(cookie?.value ?? null);
    });
  });
}

/** Query the currently active browser tab */
export function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      resolve(null);
      return;
    }
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve(tabs?.[0] ?? null);
    });
  });
}

/** Open a URL in a new browser tab */
export function openTab(url: string): void {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, '_blank');
  }
}
