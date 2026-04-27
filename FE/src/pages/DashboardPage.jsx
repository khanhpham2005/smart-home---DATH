import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SensorCard from '../components/Sensors/SensorCard';
import SensorChart from '../components/Sensors/SensorChart';
import QuickDeviceControl from '../components/Devices/QuickDeviceControl';
import sensorService from '../services/sensorService';
import actuatorService from '../services/actuatorService';
import webSocketService from '../services/webSocketService';
import { useSensorStore } from '../store/sensorStore';
import { useAuthStore } from '../store/authStore';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [sensors, setSensors] = useState({});
  const [actuators, setActuators] = useState([]);
  const { sensorHistory, addSensorHistory } = useSensorStore();
  const { token, user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all sensors
        const sensorsList = await sensorService.getAllSensors();
        
        // Fetch latest data for each sensor
        const sensorDataMap = {};
        for (const sensor of sensorsList) {
          try {
            const latestData = await sensorService.getLatestReading(sensor.id);
            sensorDataMap[sensor.id] = {
              ...sensor,
              value: latestData.value,
              timestamp: latestData.timestamp,
            };
            
            // Fetch history data for charts (last 24 hours)
            const historyData = await sensorService.getHistory(sensor.id);
            if (historyData && historyData.length > 0) {
              historyData.forEach((point) => {
                addSensorHistory(`sensor-${sensor.id}`, point.value, point.timestamp);
              });
            } else {
              // Fallback: add latest reading if no history
              addSensorHistory(`sensor-${sensor.id}`, latestData.value);
            }
          } catch (error) {
            console.warn(`Failed to fetch data for sensor ${sensor.id}`, error);
            addSensorHistory(`sensor-${sensor.id}`, 0);
          }
        }
        setSensors(sensorDataMap);

        // Fetch all actuators for quick control
        const actuatorsList = await actuatorService.getAllActuators();
        setActuators(actuatorsList);
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Get refresh interval from settings (default 5 seconds)
    const savedSettings = localStorage.getItem('appSettings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    const refreshInterval = (settings.autoRefreshInterval || 5) * 1000;

    // Set up auto-refresh with configurable interval
    const interval = setInterval(fetchData, refreshInterval);

    // Set up WebSocket connection for real-time updates
    if (token && user?.id) {
      webSocketService.connect(
        token,
        () => {
          console.log('WebSocket connected');
          // Subscribe to user-specific topic for real-time updates
          webSocketService.subscribe(`/topic/users/${user.id}`, (message) => {
            if (message.type === 'SENSOR_DATA') {
              // Update sensor data in real-time
              setSensors((prev) => ({
                ...prev,
                [message.payload.sensorId]: {
                  ...prev[message.payload.sensorId],
                  value: message.payload.value,
                  timestamp: message.timestamp,
                },
              }));
              addSensorHistory(`sensor-${message.payload.sensorId}`, message.payload.value);
            } else if (message.type === 'ACTUATOR_STATE') {
              // Update actuator state in real-time
              setActuators((prev) =>
                prev.map((act) =>
                  act.id === message.payload.actuatorId
                    ? { ...act, state: message.payload.state }
                    : act
                )
              );
            }
          });
        },
        (error) => {
          console.error('WebSocket connection error:', error);
        }
      );
    }

    return () => {
      clearInterval(interval);
      webSocketService.disconnect();
    };
  }, [token, user?.id, addSensorHistory]);

  const handleActuatorStateChange = async (actuatorId, newState) => {
    try {
      await actuatorService.setActuatorState(actuatorId, newState);
      // Update local state immediately
      setActuators((prev) =>
        prev.map((act) =>
          act.id === actuatorId ? { ...act, state: newState } : act
        )
      );
      toast.success('Actuator state updated');
    } catch (error) {
      toast.error('Failed to update actuator state');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">
          Real-time monitoring and control of your smart home
        </p>
      </div>

      {/* Sensor Overview Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Sensor Readings</h2>
        <div className="sensor-grid">
          {Object.values(sensors).length === 0 ? (
            <p>No sensors available</p>
          ) : (
            Object.values(sensors).map((sensor) => (
              <SensorCard
                key={sensor.id}
                title={sensor.name}
                value={sensor.value}
                unit={sensor.type === 'TEMPERATURE' ? '°C' : sensor.type === 'HUMIDITY' ? '%' : 'lux'}
                icon={
                  sensor.type === 'TEMPERATURE'
                    ? '🌡️'
                    : sensor.type === 'HUMIDITY'
                    ? '💧'
                    : '💡'
                }
                status="active"
                color={
                  sensor.type === 'TEMPERATURE'
                    ? '#ff6b6b'
                    : sensor.type === 'HUMIDITY'
                    ? '#4dabf7'
                    : '#ffd43b'
                }
              />
            ))
          )}
        </div>
      </section>

      {/* Chart Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Sensor Trends</h2>
        <div className="charts-grid">
          {Object.values(sensors).map((sensor) => (
            <div key={sensor.id} className="chart-container">
              <h3>{sensor.name} History</h3>
              <SensorChart
                data={sensorHistory[`sensor-${sensor.id}`] || []}
                label={`${sensor.name} (${sensor.type})`}
                color={
                  sensor.type === 'TEMPERATURE'
                    ? '#ff6b6b'
                    : sensor.type === 'HUMIDITY'
                    ? '#4dabf7'
                    : '#ffd43b'
                }
              />
            </div>
          ))}
        </div>
      </section>

      {/* Quick Device Control */}
      {actuators.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title">Quick Device Control</h2>
          <QuickDeviceControl devices={actuators} onToggle={handleActuatorStateChange} />
        </section>
      )}

      {/* Status Bar */}
      <div className="dashboard-status">
        <p>
          Last updated: {new Date().toLocaleTimeString()}
        </p>
        <p>
          Active sensors: {Object.keys(sensors).length}
        </p>
        <p>
          Connected actuators: {actuators.length}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
