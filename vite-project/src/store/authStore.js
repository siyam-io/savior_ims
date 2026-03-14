 import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false, // Default to false, let the /me endpoint verify the cookie on load
  isInitialized: false,

  login: (userData) => {
    set({ user: userData, isAuthenticated: true, isInitialized: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, isInitialized: true });
  },

  setUser: (userData) => {
    set({ user: userData, isAuthenticated: true, isInitialized: true });
  },

  setUnauthenticated: () => {
    set({ user: null, isAuthenticated: false, isInitialized: true });
  },
}));

export default useAuthStore;