import React from "react";
import { Link } from "react-router-dom";
import { siteData } from "./Data";
import "./DatabaseView.css";

const DatabaseView = () => (
  <div className="db-container">
    <header className="db-header">
      <h2>All Site Details</h2>
      <Link to="/ev-dashboard" className="back-btn">⬅ Back to Map</Link>
    </header>

    <table className="db-table">
      <thead>
        <tr>
          <th>ID</th><th>Corridor</th><th>Lat</th><th>Lon</th><th>Description</th>
        </tr>
      </thead>
      <tbody>
        {siteData.map((s, i) => (
          <tr key={i}>
            <td>{s.id}</td>
            <td>{s.corridor}</td>
            <td>{s.coordinates[1]}</td>
            <td>{s.coordinates[0]}</td>
            <td>{s.description || "–"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DatabaseView;