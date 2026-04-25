import React from 'react';
import './SensorCard.css';

const SensorCard = ({ title, value, unit, icon, status, color }) => {
  return (
    <div className="sensor-card" style={{ borderLeftColor: color }}>
      <div className="sensor-header">
        <span className="sensor-icon">{icon}</span>
        <span className={`sensor-status status-${status}`}></span>
      </div>
      
      <h3 className="sensor-title">{title}</h3>
      
      <div className="sensor-value">
        <span className="value" style={{ color }}>
          {value !== null && value !== undefined ? value.toFixed(2) : 'N/A'}
        </span>
        <span className="unit">{unit}</span>
      </div>

      <p className="sensor-timestamp">
        {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

export default SensorCard;
