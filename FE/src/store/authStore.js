import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      setAuth: (isAuthenticated, user, token) =>
        set({ isAuthenticated, user, token }),

      logout: () =>
        set({ isAuthenticated: false, user: null, token: null }),

      initializeAuth: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          set({
            isAuthenticated: true,
            token,
            user: JSON.parse(user),
          });
        }
      },

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
export { useAuthStore };
