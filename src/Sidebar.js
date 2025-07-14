import React from "react";
import "./Sidebar.css";

const Sidebar = ({ corridors, onSelect }) => {
  return (
    <div className="sidebar">
      <h2>EV Corridors</h2>
      <div className="corridor-list">
        {corridors.map(corridor => (
  <div
    key={corridor.id}
    className={`sidebar-corridor ${selectedCorridor === corridor.id ? 'selected' : ''}`}
    onClick={() => onSelect(corridor.id)}
  >
    {corridor.name}
  </div>
))}

      </div>
    </div>
  );
};

export default Sidebar;