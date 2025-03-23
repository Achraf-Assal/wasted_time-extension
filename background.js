let youtubeTime = 0; // Total time spent on YouTube in seconds
let intervalId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTime") {
        sendResponse({ time: youtubeTime });
    }
    else if (message.action === "currentTab") {
      currentTab()
        .then((url) => {
          console.log("current tab",url);
          sendResponse(url);
        }
        ).catch((error) => {
          console.error(error);
          sendResponse(null);
        });
        return true
    }
});

// Check if the current tab is YouTube
function isYouTubeTab(tab) {
  return tab.url && tab.url.includes("youtube.com");
}

// Start tracking time
function startTracking() {
  if (!intervalId) {
    intervalId = setInterval(() => {
      youtubeTime++;
      console.log(`Time spent on YouTube: ${youtubeTime} seconds`);
    }, 1000); // Update every second
  }
}

// Stop tracking time
function stopTracking() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
function currentTab() {
     return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      }else{
        resolve(tab.url);
      }
    });
     });
}
// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && isYouTubeTab(tab)) {
    startTracking();
  } else {
    stopTracking();
  }
});

// Listen for tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (isYouTubeTab(tab)) {
      startTracking();
    } else {
      stopTracking();
    }
  });
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener(() => {
  stopTracking();
});

