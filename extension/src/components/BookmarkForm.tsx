/**
 * BookmarkForm — the main form for editing and saving a bookmark.
 * Handles tab preview, title/url inputs, validation, and submit.
 */

import { useState, useEffect } from 'react';
import {
  Plus, Loader2, CheckCircle2, AlertCircle,
  Link as LinkIcon, Type, ExternalLink, LayoutDashboard,
} from 'lucide-react';
import { BookmarkSchema } from '../lib/validation';
import { getAccessToken } from '../lib/chrome';
import { addBookmark } from '../lib/api';
import { openTab } from '../lib/chrome';
import { API_BASE_URL } from '../lib/constants';
import type { User, TabInfo, StatusMessage, FormErrors } from '../types';

interface BookmarkFormProps {
  user: User;
  tab: TabInfo;
  onSaved: () => void;
}

export function BookmarkForm({ user, tab, onSaved }: BookmarkFormProps) {
  const [title, setTitle] = useState(tab.title);
  const [url, setUrl] = useState(tab.url);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  // Sync form fields when the active tab changes
  useEffect(() => {
    setTitle(tab.title);
    setUrl(tab.url);
    setStatus(null);
    setErrors({});
  }, [tab.url, tab.title]);

  const handleSave = async () => {
    // Validate
    try {
      await BookmarkSchema.validate({ title, url }, { abortEarly: false });
      setErrors({});
    } catch (err: any) {
      const fieldErrors: FormErrors = {};
      err.inner?.forEach((e: any) => {
        fieldErrors[e.path as keyof FormErrors] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    setStatus(null);

    const token = await getAccessToken();
    if (!token) {
      setStatus({ type: 'error', message: 'Session expired. Please login again.' });
      setSaving(false);
      return;
    }

    const success = await addBookmark({ url, title, userId: user.id }, token);

    if (success) {
      setStatus({ type: 'success', message: 'Bookmark saved!' });
      onSaved();
    } else {
      setStatus({ type: 'error', message: 'Failed to save bookmark' });
    }

    setSaving(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
          Quick Save
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Active Tab Preview */}
      <div className="flex items-center gap-3 p-3 bg-muted rounded-xl border">
        {tab.favicon ? (
          <img src={tab.favicon} className="w-10 h-10 rounded-lg border bg-white p-1" alt="" />
        ) : (
          <div className="w-10 h-10 rounded-lg border bg-white flex items-center justify-center text-primary">
            <ExternalLink size={18} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase text-primary tracking-widest">Active Tab</p>
          <p className="text-[11px] text-muted-foreground truncate">{url || 'Switch to a tab...'}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block px-1">
            <Type size={12} className="inline mr-1" /> Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
            placeholder="Bookmark name"
            className={`std-input ${errors.title ? 'border-red-400 ring-1 ring-red-100' : ''}`}
          />
          {errors.title && (
            <p className="text-[10px] font-bold text-red-500 mt-1 px-2 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block px-1">
            <LinkIcon size={12} className="inline mr-1" /> URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setErrors((p) => ({ ...p, url: undefined })); }}
            placeholder="https://..."
            className={`std-input font-mono text-xs ${errors.url ? 'border-red-400 ring-1 ring-red-100' : ''}`}
          />
          {errors.url && (
            <p className="text-[10px] font-bold text-red-500 mt-1 px-2 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.url}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving || status?.type === 'success'}
          className="std-btn-primary w-full flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={18} />
            : status?.type === 'success' ? <CheckCircle2 size={18} />
              : <Plus size={18} />}
          {status?.type === 'success' ? 'Saved!' : 'Add to Bookmarks'}
        </button>

        <button
          onClick={() => openTab(API_BASE_URL)}
          className="std-btn-secondary w-full flex items-center justify-center gap-2"
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>
      </div>

      {/* Status Toast */}
      {status && (
        <div
          className={`text-xs font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
            }`}
        >
          {status.type === 'error' && <AlertCircle size={14} />}
          {status.type === 'success' && <CheckCircle2 size={14} />}
          {status.message}
        </div>
      )}
    </div>
  );
}
