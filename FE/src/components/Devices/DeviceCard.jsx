import React from 'react';
import { Power, Trash2 } from 'lucide-react';
import './DeviceCard.css';

const DeviceCard = ({ device, actuators = [], onActuatorStateChange, onDelete }) => {
  const getActuatorIcon = (type) => {
    switch (type) {
      case 'FAN':
        return '🌪️';
      case 'LIGHT':
        return '💡';
      case 'RELAY':
        return '⚡';
      case 'SWITCH':
        return '🔘';
      default:
        return '🔌';
    }
  };

  const handleActuatorToggle = (actuator) => {
    const newState = actuator.state === 'ON' ? 'OFF' : 'ON';
    onActuatorStateChange(actuator.id, newState);
  };

  return (
    <div className="device-card">
      <div className="device-header">
        <div className="device-info">
          <h3 className="device-name">{device.name}</h3>
          <p className="device-type">{device.deviceCode || 'Device'}</p>
          {device.locationName && <p className="device-location">{device.locationName}</p>}
        </div>
      </div>

      {/* Actuators Control */}
      {actuators && actuators.length > 0 ? (
        <div className="device-actuators">
          {actuators.map((actuator) => (
            <div key={actuator.id} className="actuator-control">
              <div className="actuator-info">
                <span className="actuator-icon">{getActuatorIcon(actuator.type)}</span>
                <div>
                  <p className="actuator-name">{actuator.name}</p>
                  <p className="actuator-type">{actuator.type}</p>
                </div>
              </div>
              <div className={`actuator-status ${actuator.state}`}>
                {actuator.state || 'UNKNOWN'}
              </div>
              <button
                className={`control-button toggle ${actuator.state === 'ON' ? 'on' : 'off'}`}
                onClick={() => handleActuatorToggle(actuator)}
                title={actuator.state === 'ON' ? 'Turn off' : 'Turn on'}
              >
                <Power size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-actuators">
          <p>No actuators configured for this device</p>
        </div>
      )}

      <div className="device-controls">
        <button
          className="control-button delete"
          onClick={onDelete}
          title="Delete device"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
