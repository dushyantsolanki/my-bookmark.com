/**
 * Shared TypeScript interfaces for the MyBookmark extension.
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Stats {
  totalBookmarks: number;
  favorites: number;
  collections: number;
  tags: number;
}

export interface TabInfo {
  url: string;
  title: string;
  favicon: string;
}

export interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}

export interface FormErrors {
  title?: string;
  url?: string;
}
