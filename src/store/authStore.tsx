import { getAccessToken } from '@/shared/utils/helpers';
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  loading: boolean;
  loadToken: () => Promise<void>;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  loading: true,
  loadToken: async () => {
    const token = await getAccessToken();
    set({ token, loading: false });
  },
  setToken: (token: string | null) => set({ token }),
}));
