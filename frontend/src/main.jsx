import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./utils/api";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

if (typeof window !== "undefined") {
  window.API_BASE_URL = API_BASE_URL;
}

if (import.meta.env.DEV || import.meta.env.PROD) {
  // console.info("[API] Using base URL:", API_BASE_URL);
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const method = error.config?.method?.toUpperCase() || "UNKNOWN";
    const url = error.config?.url || "(unknown URL)";
    const status = error.response?.status;
    const statusText = error.response?.statusText;

    const isAuthSessionCheck =
      typeof url === "string" && url.includes("/api/auth/session");

    if (isAuthSessionCheck && status === 401) {
      console.info("[API] Auth session check returned 401 (not logged in)");
      return Promise.reject(error);
    }

    const statusLabel =
      typeof status === "number"
        ? `${status}${statusText ? ` ${statusText}` : ""}`
        : "no-status";

    console.error(
      `[API] ${method} ${url} failed (${statusLabel})`,
      error.response?.data || error.message || error
    );

    return Promise.reject(error);
  }
);



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
