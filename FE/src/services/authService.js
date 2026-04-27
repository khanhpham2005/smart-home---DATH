import api from './api';
import { mockUsers } from './mockData';

const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

const authService = {
  login: async (email, password) => {
    try {
      // Demo mode: authenticate with mock data
      if (DEMO_MODE) {
        const user = mockUsers[email];
        if (!user || user.password !== password) {
          throw new Error('Invalid email or password');
        }

        // Generate fake JWT token
        const token = 'demo-jwt-token-' + Date.now();
        const userData = { id: user.id, name: user.name, email: user.email };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('expiresAt', new Date(Date.now() + 3600000).toISOString());

        return {
          token,
          user: userData,
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
        };
      }

      // Production mode: use real API (connects to actual backend)
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        // Map backend response to frontend format (backend sends firstName/lastName)
        const userData = {
          id: response.data.user?.id,
          name: `${response.data.user?.firstName || ''} ${response.data.user?.lastName || ''}`.trim(),
          firstName: response.data.user?.firstName,
          lastName: response.data.user?.lastName,
          email: response.data.user?.email,
        };
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('expiresAt', response.data.expiresAt);
      }
      return {
        token: response.data.token,
        user: {
          id: response.data.user?.id,
          name: `${response.data.user?.firstName || ''} ${response.data.user?.lastName || ''}`.trim(),
          firstName: response.data.user?.firstName,
          lastName: response.data.user?.lastName,
          email: response.data.user?.email,
        },
        expiresAt: response.data.expiresAt,
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default authService;
