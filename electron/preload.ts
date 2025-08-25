import { contextBridge, ipcRenderer } from 'electron';

import { IUser } from './types/IUser';

// Define the API interface
export interface IElectronAPI {
  // App info
  getVersion: () => Promise<string>;

  initToken: () => Promise<string | null>;
  saveToken: (t: string) => Promise<boolean>;
  getToken: () => Promise<string | null>;
  removeToken: () => Promise<boolean>;

  saveUser: (u: IUser) => Promise<boolean>;
  getUser: () => Promise<IUser | null>;
  removeUser: () => Promise<boolean>;

  check: () => Promise<any>;
  download: () => Promise<void>;
  install: () => Promise<any>;
  onStatus: (cb: (p: any) => void) => void;
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

  // Auto update
  check: () => ipcRenderer.invoke('update:check'),
  download: () => ipcRenderer.invoke('update:download'),
  install: () => ipcRenderer.invoke('update:install'),
  onStatus: (cb: (p: any) => void) => {
    const listener = (_e: any, payload: any) => cb(payload);
    ipcRenderer.on('update:status', listener);
    return () => ipcRenderer.removeListener('update:status', listener);
  },
});
