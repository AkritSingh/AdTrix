import React from "react";
import { createRoot } from "react-dom/client";
import './css/panel.css';
import './css/font.css';
import './css/color.css';
import './css/common.css';
import Page from "./components/organisms/Page/page";

function init() {
    const appContainer = document.createElement('div')
    document.body.appendChild(appContainer)
    if (!appContainer) {
        throw new Error("Can not find AppContainer");
    }
    const root = createRoot(appContainer)
    root.render(<Page />);
}

init();