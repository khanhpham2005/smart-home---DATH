import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SensorCard from '../components/Sensors/SensorCard';
import SensorChart from '../components/Sensors/SensorChart';
import QuickDeviceControl from '../components/Devices/QuickDeviceControl';
import sensorService from '../services/sensorService';
import actuatorService from '../services/actuatorService';
import { useSensorStore } from '../store/sensorStore';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [sensors, setSensors] = useState({});
  const [actuators, setActuators] = useState([]);
  const { sensorHistory, addSensorHistory } = useSensorStore();

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
            
            // Add to history
            addSensorHistory(`sensor-${sensor.id}`, latestData.value);
          } catch (error) {
            console.warn(`Failed to fetch data for sensor ${sensor.id}`, error);
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

    // Set up auto-refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

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
          <QuickDeviceControl devices={actuators} />
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
