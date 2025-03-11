(function () {
    window.adtrixdata = window.adtrixdata || {};
    window.adtrixdataAll = window.adtrixdataAll || [];

    // Function to send fresh adtrixdata
    function sendFreshDataToContentScript() {
        window.adtrixdataAll =[];
        window.adtrixdataAllArr =[];
        Object.keys(window.adtrixdata).forEach(hostname => {
            window.adtrixdata[hostname].forEach(entry => {
                var entry_id= entry.request.url+  '_' + entry.request.requestTime;
                if(!window.adtrixdataAllArr.includes(entry_id)){
                    window.adtrixdataAllArr.push(entry_id);
                    window.adtrixdataAll.push({
                        hostname,
                        url: entry.request.url,
                        request: entry.request,
                        response:entry.response
                    });
                }
            })
        })
        window.postMessage({ type: "ADTRIX_DATA_RESPONSE", data: window.adtrixdata, allData: window.adtrixdataAll }, "*");
    }

    // Listen for requests from contentScript.js
    window.addEventListener("message", (event) => {
        if (event.source !== window || event.data?.type !== "REQUEST_ADTRIX_DATA") return;
        sendFreshDataToContentScript();
    });
    const windowHeight = window.innerHeight;
    const originalFetch = window.fetch;
    const originalXhrOpen = XMLHttpRequest.prototype.open;
  
    // Initialize adtrixdata object inside window
  
    // Capture time when the page loads
    const pageLoadTime = performance.now();
  
    // Utility to get timestamp in milliseconds since page load
    // function getTimeSinceLoad() {
    //     return (performance.now() - pageLoadTime).toFixed(2) + "ms";
    // }
  
    // Utility to capture current scroll position
    function getScrollPosition() {
        return {
            viewport: (window.scrollY / windowHeight).toFixed(3),
            fromTop: window.scrollY
        };
    }
  
    // Utility to extract hostname from URL
    function getHostName(url) {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return "unknown_host";
        }
    }
  
    // Function to check if an entry already exists
    function findExistingEntry(hostname, url, requestTime) {
        if (!window.adtrixdata[hostname]) return null;
  
        return window.adtrixdata[hostname].find(
            (entry) =>
                entry.request.url === url &&
                entry.request.requestTime === requestTime
        );
    }
  
    // Store request and response data, avoiding duplicates and sorting by requestTime
    function storeNetworkData(hostname, request, response) {
        if (!window.adtrixdata[hostname]) {
            window.adtrixdata[hostname] = [];
        }
  
        const existingEntry = findExistingEntry(
            hostname,
            request.url,
            request.requestTime,
        );
  
        if(!(!request.method && request.initiator == 'fetch')){
            if (existingEntry) {
                // Keep the entry with a response
                if (!(existingEntry.response && existingEntry.response.responseTime) && (response && response.responseTime)) {
                    existingEntry.response = response;
                }
            } else {
                window.adtrixdata[hostname].push({ request, response });
                // Sort the requests for this hostname by requestTime in ascending order
                window.adtrixdata[hostname].sort((a, b) => {
                    return parseFloat(a.request.requestTime) - parseFloat(b.request.requestTime);
                });
            }
        }
        
    }
  
    // Intercept Fetch API
    window.fetch = async (...args) => {
        const startTime = performance.now();
        const requestUrl = args[0];
        const requestOptions = args[1] || {};
        const requestBody = requestOptions.body || "No body";
        const headers = requestOptions.headers || {};
        const hostname = getHostName(requestUrl);
  
        const requestDetails = {
            url: requestUrl,
            method: requestOptions.method || "GET",
            headers: headers,
            body: requestBody,
            scrollPosition: getScrollPosition(),
            requestTime: startTime,
            initiator: "fetch",
        };
  
        const response = await originalFetch(...args);
        const clonedResponse = response.clone();
        const endTime = performance.now();
  
        let responseBody = "No response body";
        try {
            responseBody = await clonedResponse.text(); // Read response correctly
        } catch (error) {
            console.error("Error reading fetch response:", error);
        }
  
        const responseDetails = {
            url: requestUrl,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            body: responseBody.substring(0, 1000), // Limit body length
            scrollPosition: getScrollPosition(),
            requestTime: requestDetails.requestTime,
            responseTime: endTime,
            duration: (endTime - startTime).toFixed(2) + "ms", // Correct duration
            initiator: "fetch",
        };
  
        storeNetworkData(hostname, requestDetails, responseDetails);
  
        return response;
    };
  
    // Intercept XMLHttpRequest
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        const xhr = this;
        const startTime = performance.now();
        const hostname = getHostName(url);
  
        xhr.addEventListener("load", function () {
            const endTime = performance.now();
  
            const requestDetails = {
                url: url,
                method: method,
                scrollPosition: getScrollPosition(),
                requestTime: startTime,
                initiator: "xmlhttprequest",
            };
  
            const responseDetails = {
                url: url,
                status: xhr.status,
                responseHeaders: xhr.getAllResponseHeaders(),
                body: xhr.responseText.substring(0, 1000), // Limit response body
                scrollPosition: getScrollPosition(),
                requestTime: startTime,
                responseTime: endTime,
                duration: (endTime - startTime).toFixed(2) + "ms", // Correct duration
                initiator: "xmlhttprequest",
            };
  
            storeNetworkData(hostname, requestDetails, responseDetails);
        });
  
        originalXhrOpen.call(this, method, url, ...rest);
    };
  
    // Capture ALL network requests (JS, CSS, Fonts, but IGNORE images)
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            const hostname = getHostName(entry.name);
            const resourceType = entry.initiatorType || "unknown";
  
            // Ignore images
            if (["img", "beacon"].includes(resourceType)) return;
  
            const resourceDetails = {
                url: entry.name,
                initiator: resourceType,
                requestTime: performance.now(), // Capture the timestamp of resource loading
                scrollPosition: getScrollPosition(),
            };
  
            storeNetworkData(hostname, resourceDetails, {});
        });
    });
  
    observer.observe({ type: "resource", buffered: true });
  
    // Provide an API to get all network logs
    window.getNetworkLogs = () => window.adtrixdata;
  })();