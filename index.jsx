import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { JobProvider } from "./context/JobProvider";

// 1. Find the HTML element
const rootElement = document.getElementById("root");

// 2. Render the App ONCE
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
