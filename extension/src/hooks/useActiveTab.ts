/**
 * useActiveTab — polls the browser's active tab every TAB_POLL_INTERVAL ms.
 *
 * Returns the current tab's url, title, and favicon.
 * Only updates state when the URL actually changes (avoids unnecessary renders).
 */

import { useState, useEffect, useRef } from 'react';
import { TAB_POLL_INTERVAL } from '../lib/constants';
import { getActiveTab } from '../lib/chrome';
import type { TabInfo } from '../types';

export function useActiveTab(): TabInfo {
  const [tab, setTab] = useState<TabInfo>({ url: '', title: '', favicon: '' });
  const lastUrlRef = useRef('');

  useEffect(() => {
    const poll = async () => {
      const activeTab = await getActiveTab();
      if (activeTab?.url && activeTab.url !== lastUrlRef.current) {
        lastUrlRef.current = activeTab.url;
        setTab({
          url: activeTab.url,
          title: activeTab.title || '',
          favicon: activeTab.favIconUrl || '',
        });
      }
    };

    poll();
    const interval = setInterval(poll, TAB_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return tab;
}
