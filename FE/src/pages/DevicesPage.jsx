import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DeviceList from '../components/Devices/DeviceList';
import deviceService from '../services/deviceService';
import actuatorService from '../services/actuatorService';
import { useDeviceStore } from '../store/deviceStore';
import '../styles/DevicesPage.css';

const DevicesPage = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevicesList] = useState([]);
  const [deviceActuators, setDeviceActuators] = useState({});
  const { setDevices } = useDeviceStore();

  useEffect(() => {
    fetchDevicesAndActuators();
  }, []);

  const fetchDevicesAndActuators = async () => {
    setLoading(true);
    try {
      // Fetch all devices
      const devicesData = await deviceService.getDevices();
      setDevicesList(devicesData);
      setDevices(devicesData);

      // Fetch actuators for each device
      const actuatorMap = {};
      for (const device of devicesData) {
        try {
          const actuators = await actuatorService.getActuatorsByDevice(device.id);
          actuatorMap[device.id] = actuators;
        } catch (error) {
          console.warn(`Failed to fetch actuators for device ${device.id}`, error);
          actuatorMap[device.id] = [];
        }
      }
      setDeviceActuators(actuatorMap);
    } catch (error) {
      toast.error('Failed to load devices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleActuatorStateChange = async (actuatorId, newState) => {
    try {
      await actuatorService.setActuatorState(actuatorId, newState);
      toast.success('Actuator state updated');
      fetchDevicesAndActuators();
    } catch (error) {
      toast.error('Failed to update actuator');
      console.error(error);
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await deviceService.deleteDevice(deviceId);
        toast.success('Device deleted successfully');
        fetchDevicesAndActuators();
      } catch (error) {
        toast.error('Failed to delete device');
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="devices-loading">
        <div className="spinner"></div>
        <p>Loading devices...</p>
      </div>
    );
  }

  return (
    <div className="devices-page">
      <div className="devices-header">
        <h1>Devices</h1>
        <p className="devices-subtitle">
          Manage and control all your smart home devices
        </p>
      </div>

      <div className="devices-content">
        {devices.length === 0 ? (
          <div className="no-devices">
            <p>No devices configured yet</p>
            <p className="no-devices-hint">
              Add devices from the settings page to get started
            </p>
          </div>
        ) : (
          <DeviceList
            devices={devices}
            deviceActuators={deviceActuators}
            onActuatorStateChange={handleActuatorStateChange}
            onDelete={handleDeleteDevice}
          />
        )}
      </div>
    </div>
  );
};

export default DevicesPage;
