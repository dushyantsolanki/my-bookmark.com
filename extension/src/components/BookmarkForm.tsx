import { useState, useEffect } from 'react';
import {
  Plus, Loader2, CheckCircle2, AlertCircle,
  Type, ExternalLink, LayoutDashboard,
  Tags, FolderOpen, Link,
} from 'lucide-react';
import { BookmarkSchema } from '../lib/validation';
import { getAccessToken } from '../lib/chrome';
import { addBookmark, fetchCollections, createCollection, fetchTags, createTag } from '../lib/api';
import { openTab } from '../lib/chrome';
import { API_BASE_URL } from '../lib/constants';
import { TagBadge } from './TagBadge';
import type { User, TabInfo, StatusMessage, FormErrors, Collection, Tag as TagType } from '../types';

interface BookmarkFormProps {
  user: User;
  tab: TabInfo;
  onSaved: () => void;
  status: StatusMessage | null;
  onStatusChange: (status: StatusMessage | null) => void;
}

export function BookmarkForm({ user, tab, onSaved, status, onStatusChange }: BookmarkFormProps) {
  const [title, setTitle] = useState(tab.title);
  const [url, setUrl] = useState(tab.url);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Collections & Tags State
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Creation State
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewTag, setShowNewTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const token = await getAccessToken();
      if (!token) return;

      const [cols, tgList] = await Promise.all([
        fetchCollections(user.id, token),
        fetchTags(user.id, token)
      ]);

      setCollections(cols);
      setTags(tgList);
      setLoadingData(false);
    };

    loadData();
  }, [user.id]);

  // Sync form fields when the active tab changes
  useEffect(() => {
    setTitle(tab.title);
    setUrl(tab.url);
    onStatusChange(null);
    setErrors({});
    setSelectedCollection('');
    setSelectedTags([]);
    setShowNewCollection(false);
    setShowNewTag(false);
  }, [tab.url, tab.title]);


  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    const token = await getAccessToken();
    if (!token) return;

    const newCol = await createCollection({ name: newCollectionName, userId: user.id }, token);
    if (newCol) {
      setCollections([...collections, newCol]);
      setSelectedCollection(newCol._id);
      setNewCollectionName('');
      setShowNewCollection(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    const token = await getAccessToken();
    if (!token) return;

    const newT = await createTag({ name: newTagName, userId: user.id }, token);
    if (newT) {
      setTags([...tags, newT]);
      setSelectedTags([...selectedTags, newT._id]);
      setNewTagName('');
      setShowNewTag(false);
    }
  };

  const handleSave = async () => {

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
    onStatusChange(null);

    const token = await getAccessToken();
    if (!token) {
      onStatusChange({ type: 'error', message: 'Session expired. Please login again.' });
      setSaving(false);
      return;
    }

    const success = await addBookmark({
      url,
      title,
      userId: user.id,
      collectionId: selectedCollection || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined
    }, token);

    if (success) {
      onStatusChange({ type: 'success', message: 'Bookmark saved!' });
      onSaved();
    } else {
      onStatusChange({ type: 'error', message: 'Failed to save bookmark' });
    }

    setSaving(false);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* Active Tab Preview */}
      <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant">
        {tab.favicon ? (
          <img src={tab.favicon} className="w-10 h-10 rounded-lg border bg-surface-bright p-1" alt="" />
        ) : (
          <div className="w-10 h-10 rounded-lg border bg-surface-bright flex items-center justify-center text-primary">
            <ExternalLink size={18} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase text-primary tracking-widest">Active Tab</p>
          <p className="text-[11px] text-on-surface-variant truncate">{url || 'Switch to a tab...'}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Title */}
        {/* Title */}
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block px-1">
            <Type size={12} className="inline mr-1" /> Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
            placeholder="Bookmark name"
            className={`std-input ${errors.title ? 'border-error ring-1 ring-error/20' : ''}`}
          />
          {errors.title && (
            <p className="text-[10px] font-bold text-error mt-1 px-1 flex items-center gap-1 animate-fade-in">
              <AlertCircle size={10} /> {errors.title}
            </p>
          )}
        </div>

        {/* URL */}
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase mb-1.5 block px-1">
            <Link size={12} className="inline mr-1" /> URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setErrors((p) => ({ ...p, url: undefined })); }}
            placeholder="https://example.com"
            className={`std-input ${errors.url ? 'border-error ring-1 ring-error/20' : ''}`}
          />
          {errors.url && (
            <p className="text-[10px] font-bold text-error mt-1 px-1 flex items-center gap-1 animate-fade-in">
              <AlertCircle size={10} /> {errors.url}
            </p>
          )}
        </div>

        {/* Collection Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase flex items-center gap-1">
              <FolderOpen size={12} /> Collection
            </label>
            <button
              onClick={() => setShowNewCollection(!showNewCollection)}
              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              <Plus size={10} /> New
            </button>
          </div>

          {showNewCollection ? (
            <div className="flex gap-2 animate-fade-in">
              <input
                type="text"
                autoFocus
                placeholder="Collection name..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
                className="std-input flex-1 py-2 text-xs"
              />
              <button
                onClick={handleCreateCollection}
                className="bg-primary text-on-primary px-3 rounded-lg text-xs font-bold"
              >
                Add
              </button>
            </div>
          ) : (
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="std-input py-2.5 text-xs appearance-none cursor-pointer"
            >
              <option value="">Uncategorized</option>
              {collections.map(col => (
                <option key={col._id} value={col._id}>{col.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Tags Selection */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase flex items-center gap-1">
              <Tags size={12} /> Tags
            </label>
            <button
              onClick={() => setShowNewTag(!showNewTag)}
              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              <Plus size={10} /> New
            </button>
          </div>

          {showNewTag && (
            <div className="flex gap-2 mb-3 animate-fade-in">
              <input
                type="text"
                autoFocus
                placeholder="Tag name..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                className="std-input flex-1 py-2 text-xs"
              />
              <button
                onClick={handleCreateTag}
                className="bg-primary text-on-primary px-3 rounded-lg text-xs font-bold"
              >
                Add
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto px-1">
            {tags.length === 0 && !loadingData && (
              <p className="text-[10px] text-on-surface-variant italic">No tags created yet.</p>
            )}
            {tags.map(tag => (
              <TagBadge
                key={tag._id}
                name={tag.name}
                isSelected={selectedTags.includes(tag._id)}
                onClick={() => toggleTag(tag._id)}
              />
            ))}
          </div>
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

    </div>
  );
}
