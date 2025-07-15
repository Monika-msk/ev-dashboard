import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import DatabaseView from "./DatabaseView";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/ev-dashboard" element={<App />} />
        <Route path="/ev-dashboard/database" element={<DatabaseView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);