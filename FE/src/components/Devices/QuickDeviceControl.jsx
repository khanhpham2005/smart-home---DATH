import React from 'react';
import { Power } from 'lucide-react';
import actuatorService from '../../services/actuatorService';
import { toast } from 'react-toastify';
import './QuickDeviceControl.css';

const QuickDeviceControl = ({ devices, onToggle }) => {
  const handleToggle = async (actuator) => {
    try {
      const newState = actuator.state === 'ON' ? 'OFF' : 'ON';
      if (onToggle) {
        await onToggle(actuator.id, newState);
      } else {
        await actuatorService.setActuatorState(actuator.id, newState);
        toast.success(`${actuator.name} turned ${newState}`);
      }
    } catch (error) {
      toast.error(`Failed to control ${actuator.name}`);
      console.error(error);
    }
  };

  if (devices.length === 0) {
    return (
      <div className="quick-control-empty">
        <p>No actuators available</p>
      </div>
    );
  }

  return (
    <div className="quick-control">
      <div className="quick-control-grid">
        {devices.map((actuator) => (
          <div key={actuator.id} className="quick-control-item">
            <button
              className={`quick-control-button ${actuator.state === 'ON' ? 'on' : 'off'}`}
              onClick={() => handleToggle(actuator)}
            >
              <Power size={24} />
            </button>
            <p className="quick-control-name">{actuator.name}</p>
            <p className="quick-control-status">
              {actuator.state || 'Unknown'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickDeviceControl;
