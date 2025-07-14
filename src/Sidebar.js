// src/Sidebar.js
import React from "react";
import "./Sidebar.css";

const Sidebar = ({ corridors, onSelect }) => {
  return (
    <div className="sidebar">
      <h2>EV Corridors</h2>
      <ul>
        {corridors.map((c) => (
          <li key={c.id} onClick={() => onSelect(c.id)}>
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
