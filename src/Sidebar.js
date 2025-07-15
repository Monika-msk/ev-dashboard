// Sidebar.js
import React from 'react';
import './Sidebar.css';
import { corridorDefs } from './Data';

const Sidebar = ({ selectedCorridorId, onSelectCorridor }) => {
  return (
    <div className="sidebar">
      <h2>Corridors</h2>
      {corridorDefs.map((corridor) => {
        const isSelected = selectedCorridorId === corridor.id;
        return (
          <div
            key={corridor.id}
            className={`corridor-box ${isSelected ? 'selected' : ''}`}
            style={{
              borderLeft: `6px solid ${corridor.color}`,
              backgroundColor: isSelected ? '#d1e7fd' : '#fff',
              cursor: 'pointer',
            }}
            onClick={() => onSelectCorridor(corridor.id === selectedCorridorId ? null : corridor.id)}
          >
            <strong>{corridor.id}</strong>: {corridor.name}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
