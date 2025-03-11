chrome.devtools.panels.create(
    "AMP ADS", // Name of the panel
    "../icon.png", // Optional icon
    "panel.html", // The HTML file for the custom panel
    function (panel) {
      panel.onShown.addListener(function (panelWindow) {
        // Send a message to the panel
        panelWindow.postMessage({ type: "panelShown" }, "*");
        console.log("Panel is now shown");
      });
    }
  );