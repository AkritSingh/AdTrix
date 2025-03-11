// Example background script (optional) - For sending messages
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed!");
    updateActiveTab(); // Ensure the active tab is updated on installation
  });
  
  
  let activeTabId = null;
  let tabRequests = {}; // Object to store all network requests per tab ID
  // setup bridge for passing messages
  // 1. pass msg from panel.js -> service_worker.js -> content_script.js
  // 2. pass response from content_script.js -> service_worker.js -> panel.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "transferNetwork" || request.action === "transferAllNetwork" ||  request.action === "transfer" || request.action === "scrollIntoView") {
      // Get the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        if (activeTab) {
          // Send the message to the content script
          chrome.tabs.sendMessage(activeTab.id, { msg: request.action, data: {...request?.data || {} } }, function (response) {
            // Send the response to the Panel js
            sendResponse({ success: true, data: response });
          });
        } else {
          sendResponse({ success: false, error: "No active tab found" });
        }
      });
      return true;
    }
    if (request.action === "setData") {
      const { data, name } = request || {};
      
      if (name && data !== undefined) {
        let mainData = { [name]: data };
        chrome.storage.local.set(mainData, () => {
          if (chrome.runtime.lastError) {
            console.error("Error saving data:", chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            console.log("Storage data saved successfully.");
            sendResponse({ success: true });
          }
        });
      } else {
        console.error("Invalid data or name:", request.data);
        sendResponse({ success: false, error: "Invalid data or name" });
      }
      
      return true; // Keep the message channel open for async response
    }
    if (request.action === "getData") {
      const { name } = request || {};  // Ensure `name` is extracted safely
    
      if (name) {
        chrome.storage.local.get([name], (result) => {
          if (chrome.runtime.lastError) {
            console.error("Error getting data:", chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            console.log("Storage data retrieved:", result);
            sendResponse({ success: true, data: result[name] });
          }
        });
      } else {
        console.error("Invalid request, missing 'name'.");
        sendResponse({ success: false, error: "Invalid request, missing 'name'" });
      }
    
      return true;  // Required to keep sendResponse open for async calls
    }
    if (request.action === "clearData") {
      // Get the active tab
      chrome.storage.local.clear(() => {
        console.log("Storage cleared");
        sendResponse({ status: "success" });
      });
      return true;
    }
      
    
    if (request.action === "getTabRequests") {
      // Fetch data from chrome.storage.local
      var searchName = request?.name || '';
      if(searchName){
        const activeTabRequests = tabRequests[activeTabId] || [];
        const filteredRequests = activeTabRequests.filter((item) => 
          item.onBeforeReq && (item.onBeforeReq.url.includes(searchName + '&') || item.onBeforeReq.url.includes(searchName + '%'))
        );
        const tabLoadStart = tabRequests[`${activeTabId}_load`]
  
        if (chrome.runtime.lastError) {
          console.error("Error retrieving tabRequests:", chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
          return;
        }
    
        // Send the retrieved data back to panel.js
        sendResponse({ success: true, tabRequests: filteredRequests, tabLoadStart: tabLoadStart });
      }
      
  
      // Keep the message channel open for async response
      return true;
    }
  });
  
  
  // Function to update the active tab ID
  function updateActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        activeTabId = tabs[0].id;
        console.log("Active Tab ID updated:", activeTabId);
        // Ensure a request array exists for the active tab
        if (!tabRequests[activeTabId]) {
          tabRequests[activeTabId] = [];
        }
      }
    });
  }
  // Listen for tab reload or navigation
  // chrome.webNavigation.onCommitted.addListener((details) => {
  //   if (details.tabId === activeTabId && details.transitionType === "reload") {
  //     // Reset the data for the active tab
  //     tabRequests[activeTabId] = [];
  //     const currentTimestamp = Date.now();
  //     tabRequests[`${activeTabId}_load`] = currentTimestamp;
  //     console.log(`Tab data reset for tabId ${activeTabId}`);
  //   }
  // });
  
  // Capture request details
  // chrome.webRequest.onBeforeRequest.addListener(
  //   (details) => {
  //     if (details.tabId === activeTabId) {
  //       const requestData = {
  //         onBeforeReq: {...details},
  //         onCompleted: null,
  //         onError: null,
  //       };
  
  //       // Add the requestData to the active tab's array
  //       if (!tabRequests[activeTabId]) {
  //         tabRequests[activeTabId] = [];
  //       }
  //       tabRequests[activeTabId].push(requestData);
  //     }
  //   },
  //   { urls: ["<all_urls>"] },
  //   ["requestBody"]
  // );
  
  // // Log completed requests
  // chrome.webRequest.onCompleted.addListener(
  //   (details) => {
  //     if (details.tabId === activeTabId) {
  //       const matchedRequest = tabRequests[activeTabId]?.find(
  //         (req) => req.onBeforeReq && req.onBeforeReq.url === details.url
  //       );
  //       if (matchedRequest) {
  //         matchedRequest.onCompleted = {...details};
  //       }
  //     }
  //   },
  //   { urls: ["<all_urls>"] }
  // );
  
  // // Handle errors
  // chrome.webRequest.onErrorOccurred.addListener(
  //   (details) => {
  //     if (details.tabId === activeTabId) {
  //       const matchedRequest = tabRequests[activeTabId]?.find(
  //         (req) => req.onBeforeReq && req.onBeforeReq.url === details.url
  //       );
  //       if (matchedRequest) {
  //         matchedRequest.onError = {...details};
  //       }
  //     }
  //   },
  //   { urls: ["<all_urls>"] }
  // );
  
  // Ensure active tab ID is updated on service worker start
  updateActiveTab();
  chrome.tabs.onActivated.addListener(updateActiveTab);
  chrome.windows.onFocusChanged.addListener(updateActiveTab);
  
  