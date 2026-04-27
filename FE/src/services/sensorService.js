import api from './api';
import { 
  generateMockSensorData, 
  generateMockSensorDataBySensorId,
  generateMockSensorTrendData,
  generateMockSensorHistoryData,
  mockSensors, 
  mockSensorDataReadings,
  getMockSensorCurrentValue 
} from './mockData';

const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

const sensorService = {
  // Get all sensors
  getAllSensors: async () => {
    try {
      if (DEMO_MODE) {
        return mockSensors;
      }

      const response = await api.get('/sensors/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get sensors with pagination
  getSensors: async (page = 0, size = 20, filters = {}) => {
    try {
      if (DEMO_MODE) {
        return {
          content: mockSensors,
          totalElements: mockSensors.length,
          totalPages: 1,
          currentPage: 0,
        };
      }

      const params = new URLSearchParams({
        page,
        size,
        ...filters,
      });

      const response = await api.get(`/sensors?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single sensor
  getSensor: async (sensorId) => {
    try {
      if (DEMO_MODE) {
        const sensor = mockSensors.find((s) => s.id === sensorId);
        if (!sensor) throw new Error('Sensor not found');
        return sensor;
      }

      const response = await api.get(`/sensors/${sensorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get sensors by device
  getSensorsByDevice: async (deviceId) => {
    try {
      if (DEMO_MODE) {
        return mockSensors.filter((s) => s.deviceId === deviceId);
      }

      const response = await api.get(`/sensors?deviceId=${deviceId}`);
      return response.data.content || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get latest sensor reading
  getLatestReading: async (sensorId) => {
    try {
      if (DEMO_MODE) {
        return generateMockSensorDataBySensorId(sensorId) || {
          id: `reading-${sensorId}`,
          sensorId,
          value: getMockSensorCurrentValue(sensorId),
          timestamp: new Date().toISOString(),
        };
      }

      const response = await api.get(`/sensor-data/latest?sensorId=${sensorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get sensor data history
  getHistory: async (sensorId, fromTime, toTime) => {
    try {
      if (DEMO_MODE) {
        // Return realistic sensor trend data similar to backend format
        return generateMockSensorHistoryData(sensorId, fromTime, toTime);
      }

      const params = {
        sensorId,
        from: fromTime.toISOString ? fromTime.toISOString() : fromTime,
        to: toTime.toISOString ? toTime.toISOString() : toTime,
      };

      const response = await api.get('/sensor-data/history', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get paginated sensor data
  getSensorData: async (sensorId, page = 0, size = 20) => {
    try {
      if (DEMO_MODE) {
        return {
          content: generateMockSensorData(),
          totalElements: 100,
          totalPages: 5,
          currentPage: 0,
        };
      }

      const params = {
        sensorId,
        page,
        size,
      };

      const response = await api.get('/sensor-data', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create sensor
  createSensor: async (sensorData) => {
    try {
      if (DEMO_MODE) {
        return { id: Date.now(), ...sensorData };
      }

      const response = await api.post('/sensors', sensorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update sensor
  updateSensor: async (sensorId, updateData) => {
    try {
      if (DEMO_MODE) {
        return { id: sensorId, ...updateData };
      }

      const response = await api.put(`/sensors/${sensorId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete sensor
  deleteSensor: async (sensorId) => {
    try {
      if (DEMO_MODE) {
        return { success: true };
      }

      await api.delete(`/sensors/${sensorId}`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default sensorService;
