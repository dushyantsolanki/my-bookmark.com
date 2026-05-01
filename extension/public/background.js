// Open side panel on icon click
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Send active tab info to the side panel whenever tab changes
function sendTabInfo(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError || !tab) return;
    chrome.runtime.sendMessage({
      type: 'TAB_UPDATED',
      data: {
        url: tab.url || '',
        title: tab.title || '',
        favicon: tab.favIconUrl || ''
      }
    }).catch(() => {
      // Side panel might not be open yet, ignore
    });
  });
}

// When user switches to a different tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  sendTabInfo(activeInfo.tabId);
});

// When a tab finishes loading (URL change, page refresh)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    sendTabInfo(tabId);
  }
});
