import { create } from 'zustand';
import { IUser as IUserType } from '../types';
import { getUserInfoStorage } from '@/shared/utils/helpers';

interface IUser {
  userInfo: IUserType | null;
  setUserInfo: (userInfo: IUserType) => void;
  loadUserInfo: () => Promise<void>;
}

const useUserStore = create<IUser>()(set => ({
  userInfo: null,
  setUserInfo: (userInfo: IUserType) => set(() => ({ userInfo: userInfo })),
  loadUserInfo: async () => {
    const userInfo = await getUserInfoStorage();
    set({ userInfo });
  },
}));

export default useUserStore;
