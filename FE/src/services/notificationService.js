import api from './api';

const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

const notificationService = {
  // Get all notifications
  getAllNotifications: async () => {
    try {
      if (DEMO_MODE) {
        return [];
      }

      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default notificationService;
