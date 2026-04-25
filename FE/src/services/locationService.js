import api from './api';

const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

const locationService = {
  // Get all locations
  getAllLocations: async () => {
    try {
      if (DEMO_MODE) {
        return [];
      }

      const response = await api.get('/locations/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single location with devices
  getLocation: async (locationId) => {
    try {
      if (DEMO_MODE) {
        throw new Error('Location not found');
      }

      const response = await api.get(`/locations/${locationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create location
  createLocation: async (locationData) => {
    try {
      if (DEMO_MODE) {
        return { id: Date.now(), ...locationData };
      }

      const response = await api.post('/locations', locationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update location
  updateLocation: async (locationId, updateData) => {
    try {
      if (DEMO_MODE) {
        return { id: locationId, ...updateData };
      }

      const response = await api.put(`/locations/${locationId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete location
  deleteLocation: async (locationId) => {
    try {
      if (DEMO_MODE) {
        return { success: true };
      }

      await api.delete(`/locations/${locationId}`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default locationService;
