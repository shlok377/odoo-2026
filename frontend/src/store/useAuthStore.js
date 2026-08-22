import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('itinera_user')) || null,
  token: localStorage.getItem('itinera_token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user, token } = response.data;

      localStorage.setItem('itinera_token', token);
      localStorage.setItem('itinera_user', JSON.stringify(user));

      set({ user, token, isLoading: false, error: null });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      set({ isLoading: false, error: errMsg });
      return { success: false, error: errMsg };
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      const { user, token } = response.data;

      localStorage.setItem('itinera_token', token);
      localStorage.setItem('itinera_user', JSON.stringify(user));

      set({ user, token, isLoading: false, error: null });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Registration failed. Please try again.';
      set({ isLoading: false, error: errMsg });
      return { success: false, error: errMsg };
    }
  },

  logout: () => {
    localStorage.removeItem('itinera_token');
    localStorage.removeItem('itinera_user');
    set({ user: null, token: null, error: null });
  },

  clearError: () => set({ error: null })
}));
