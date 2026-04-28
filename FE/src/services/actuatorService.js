import api from './api';
import { mockActuators } from './mockData';

const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

const actuatorService = {
  // Get all actuators
  getAllActuators: async () => {
    try {
      if (DEMO_MODE) {
        return mockActuators;
      }

      const response = await api.get('/actuators/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get actuators with pagination
  getActuators: async (page = 0, size = 20, filters = {}) => {
    try {
      if (DEMO_MODE) {
        return {
          content: mockActuators,
          totalElements: mockActuators.length,
          totalPages: 1,
          currentPage: 0,
        };
      }

      const params = new URLSearchParams({
        page,
        size,
        ...filters,
      });

      const response = await api.get(`/actuators?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single actuator
  getActuator: async (actuatorId) => {
    try {
      if (DEMO_MODE) {
        const actuator = mockActuators.find((a) => a.id === actuatorId);
        if (!actuator) throw new Error('Actuator not found');
        return actuator;
      }

      const response = await api.get(`/actuators/${actuatorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get actuators by device
  getActuatorsByDevice: async (deviceId) => {
    try {
      if (DEMO_MODE) {
        return mockActuators.filter((a) => a.deviceId === deviceId);
      }

      const response = await api.get(`/actuators?deviceId=${deviceId}`);
      return response.data.content || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Set actuator state
  setActuatorState: async (actuatorId, state) => {
    try {
      if (DEMO_MODE) {
        return { id: actuatorId, state };
      }

      const response = await api.put(`/actuators/${actuatorId}/state`, { state });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Set actuator mode
  setActuatorMode: async (actuatorId, mode) => {
    try {
      if (DEMO_MODE) {
        return { id: actuatorId, mode };
      }

      const response = await api.put(`/actuators/${actuatorId}/mode`, { mode });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update actuator
  updateActuator: async (actuatorId, updateData) => {
    try {
      if (DEMO_MODE) {
        return { id: actuatorId, ...updateData };
      }

      const response = await api.put(`/actuators/${actuatorId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create actuator
  createActuator: async (actuatorData) => {
    try {
      if (DEMO_MODE) {
        return { id: Date.now(), ...actuatorData };
      }

      const response = await api.post('/actuators', actuatorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete actuator
  deleteActuator: async (actuatorId) => {
    try {
      if (DEMO_MODE) {
        return { success: true };
      }

      await api.delete(`/actuators/${actuatorId}`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get command logs for actuator
  getCommandLogs: async (actuatorId) => {
    try {
      if (DEMO_MODE) {
        return [];
      }

      const response = await api.get(`/actuators/${actuatorId}/command-logs`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get schedules for actuator
  getSchedules: async (actuatorId) => {
    try {
      if (DEMO_MODE) {
        const { getMockSchedules } = await import('./mockData.js');
        const allSchedules = getMockSchedules();
        return allSchedules.filter(s => s.actuatorId === parseInt(actuatorId));
      }

      const response = await api.get(`/actuators/${actuatorId}/schedules`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default actuatorService;
