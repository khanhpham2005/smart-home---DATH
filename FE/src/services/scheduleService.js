import api from './api';
import { getMockSchedules, setMockSchedules } from './mockData';

const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

const scheduleService = {
  // Create schedule
  createSchedule: async (scheduleData) => {
    try {
      if (DEMO_MODE) {
        const schedules = getMockSchedules();
        const newSchedule = {
          id: Math.max(...schedules.map(s => s.id), 0) + 1,
          userId: 1,
          ...scheduleData,
          createdAt: new Date().toISOString(),
          lastExecutedAt: null,
        };
        setMockSchedules([...schedules, newSchedule]);
        return newSchedule;
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
        const schedules = getMockSchedules();
        setMockSchedules(schedules.filter(s => s.id !== scheduleId));
        return { success: true };
      }

      await api.delete(`/schedules/${scheduleId}`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get schedules for a specific actuator
  getSchedulesByActuator: async (actuatorId) => {
    try {
      if (DEMO_MODE) {
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

export default scheduleService;
