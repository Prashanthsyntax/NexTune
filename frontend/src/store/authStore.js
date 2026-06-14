import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: (data) =>
        set({
          token: data.token,
          user: {
            email: data.email,
            username: data.username,
            role: data.role,
            premium: data.premium,
          },
        }),

      logout: () => set({ token: null, user: null }),

      isAuthenticated: () => !!get().token,

      hasRole: (role) => get().user?.role === role,
    }),
    { name: 'nextune-auth' }
  )
);

export default useAuthStore;