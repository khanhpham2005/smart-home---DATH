import React from 'react';
import DeviceCard from './DeviceCard';
import './DeviceList.css';

const DeviceList = ({ devices, deviceActuators = {}, onActuatorStateChange, onDelete }) => {
  return (
    <div className="device-list">
      {devices.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          actuators={deviceActuators[device.id] || []}
          onActuatorStateChange={onActuatorStateChange}
          onDelete={() => onDelete(device.id)}
        />
      ))}
    </div>
  );
};

export default DeviceList;
