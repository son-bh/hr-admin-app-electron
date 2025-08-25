// ipcHandlers.ts
import { ipcMain, app } from 'electron';
import keytar from 'keytar';
import Store from 'electron-store';
import { IUser } from './types/IUser';

const SERVICE = 'hr-admin';
const K_ACCESS = 'access-token';

const store = new Store<IUser>() as any;

export function registerIpcHandlers() {
  console.log('Registering IPC handlers...');

  // App version
  ipcMain.handle('app:getVersion', () => app.getVersion());

  // Token handlers
  ipcMain.handle('save-token', async (_, token: string) => {
    await keytar.setPassword(SERVICE, K_ACCESS, token);
    return true;
  });

  ipcMain.handle('get-token', async () => {
    return await keytar.getPassword(SERVICE, K_ACCESS);
  });

  ipcMain.handle('remove-token', async () => {
    return await keytar.deletePassword(SERVICE, K_ACCESS);
  });

  // User handlers
  ipcMain.handle('save-user', (_, user: IUser) => {
    store.set('user', user);
    return true;
  });

  ipcMain.handle('get-user', () => {
    return store.get('user');
  });

  ipcMain.handle('remove-user', () => {
    store.delete('user');
    return true;
  });
}
