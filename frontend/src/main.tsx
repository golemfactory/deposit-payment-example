window.process = {
  env: {
    NODE_ENV: "dessvelopment",
  },
};

console.log("process.env.NODE_ENV", process);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./utils/axios";

// // @ts-ignore

console.log("VITE_BACKEND_URL", import.meta.env.VITE_BACKEND_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
