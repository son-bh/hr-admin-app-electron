import { contextBridge, ipcRenderer } from 'electron';

import { IUser } from './types/IUser';

// Define the API interface
export interface IElectronAPI {
  // App info
  getVersion: () => Promise<string>;

  initToken: () => Promise<string | null>;
  saveToken: (t: string) => Promise<boolean>;
  getToken: () => Promise<string | null>; // FIX: Promise
  removeToken: () => Promise<boolean>;

  saveUser: (u: IUser) => Promise<boolean>;
  getUser: () => Promise<IUser | null>; // FIX: Promise
  removeUser: () => Promise<boolean>;
}

contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app:getVersion'),

  initToken: () => ipcRenderer.invoke('init-token'),
  saveToken: (token: string) => ipcRenderer.invoke('save-token', token),
  getToken: () => ipcRenderer.invoke('get-token'),
  removeToken: () => ipcRenderer.invoke('remove-token'),

  saveUser: (user: IUser) => ipcRenderer.invoke('save-user', user),
  getUser: () => ipcRenderer.invoke('get-user'),
  removeUser: () => ipcRenderer.invoke('remove-user'),
});
