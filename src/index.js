import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import "./assets/styles/index.scss";
import store from "./store/configureStore";
import "./index.css";
import { getCSP } from "./csp";

// Dynamically inject CSP meta tag
const injectCSP = () => {
  const cspContent = getCSP(process.env); // Pass environment variables
  const metaTag = document.createElement("meta");
  metaTag.httpEquiv = "Content-Security-Policy";
  metaTag.content = cspContent.trim();
  document.head.appendChild(metaTag);
};

// Inject CSP before rendering the app
injectCSP();
render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
