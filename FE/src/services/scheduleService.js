import api from './api';

const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

const scheduleService = {
  // Create schedule
  createSchedule: async (scheduleData) => {
    try {
      if (DEMO_MODE) {
        return { id: Date.now(), ...scheduleData };
      }

      const response = await api.post('/schedules', scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete schedule
  deleteSchedule: async (scheduleId) => {
    try {
      if (DEMO_MODE) {
        return { success: true };
      }

      await api.delete(`/schedules/${scheduleId}`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default scheduleService;
