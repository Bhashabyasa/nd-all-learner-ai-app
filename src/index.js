import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./assets/styles/index.scss";
import store from "./store/configureStore";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { getCSP } from "./csp";

// // Dynamically inject CSP meta tag
const injectCSP = () => {
  const cspContent = getCSP(process.env); // Pass environment variables
  const metaTag = document.createElement("meta");
  metaTag.httpEquiv = "Content-Security-Policy";
  metaTag.content = cspContent.trim();
  document.head.appendChild(metaTag);
};

let interval = setInterval(() => {
  injectCSP();
  clearInterval(interval); // Stops the interval after the first execution
}, 5000);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);
