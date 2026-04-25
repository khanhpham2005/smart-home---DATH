import api from './api';
import { mockDevices, getMockDeviceStates, setMockDeviceState } from './mockData';

const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

const deviceService = {
  // Get all devices
  getDevices: async () => {
    try {
      // Demo mode: return mock devices
      if (DEMO_MODE) {
        return mockDevices;
      }

      // Production: get from backend
      const response = await api.get('/devices/all');
      return response.data;
    } catch (error) {
      // Fallback to mock data if API fails
      if (DEMO_MODE) {
        return mockDevices;
      }
      throw error.response?.data || error;
    }
  },

  // Get single device
  getDevice: async (deviceId) => {
    try {
      if (DEMO_MODE) {
        const device = mockDevices.find((d) => d.id === deviceId);
        if (!device) throw new Error('Device not found');
        return device;
      }

      const response = await api.get(`/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get devices with pagination and filtering
  getDevicesPage: async (page = 0, size = 20, filters = {}) => {
    try {
      if (DEMO_MODE) {
        return {
          content: mockDevices,
          totalElements: mockDevices.length,
          totalPages: 1,
          currentPage: 0,
        };
      }

      const params = new URLSearchParams({
        page,
        size,
        ...filters,
      });

      const response = await api.get(`/devices?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update device
  updateDevice: async (deviceId, updateData) => {
    try {
      if (DEMO_MODE) {
        const device = mockDevices.find((d) => d.id === deviceId);
        if (!device) throw new Error('Device not found');
        return { ...device, ...updateData };
      }

      const response = await api.put(`/devices/${deviceId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new device
  createDevice: async (deviceData) => {
    try {
      if (DEMO_MODE) {
        const newDevice = { id: Date.now(), ...deviceData };
        mockDevices.push(newDevice);
        return newDevice;
      }

      const response = await api.post('/devices', deviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete device
  deleteDevice: async (deviceId) => {
    try {
      if (DEMO_MODE) {
        const index = mockDevices.findIndex((d) => d.id === deviceId);
        if (index > -1) {
          mockDevices.splice(index, 1);
        }
        return { success: true };
      }

      await api.delete(`/devices/${deviceId}`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default deviceService;
