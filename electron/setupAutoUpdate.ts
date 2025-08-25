// electron/updater.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

try {
  log.transports.file.level = 'info';
  autoUpdater.logger = log;
} catch {
  /* empty */
}

export function setupAutoUpdate(getWindow: () => BrowserWindow | null) {
  const send = (payload: any) => {
    const w = getWindow();
    if (w && !w.isDestroyed()) w.webContents.send('update:status', payload);
  };

  if (!app.isPackaged) {
    // noop handlers in dev so renderer can call without crashing
    ipcMain.handle('update:check', async () => null);
    ipcMain.handle('update:download', async () => {});
    ipcMain.handle('update:install', async () => {});
    return;
  }

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  // Main → Renderer events
  autoUpdater.on('checking-for-update', () => send({ state: 'checking' }));
  autoUpdater.on('update-available', info =>
    send({ state: 'available', info })
  );
  autoUpdater.on('update-not-available', info =>
    send({ state: 'not-available', info })
  );
  autoUpdater.on('download-progress', progress =>
    send({ state: 'downloading', progress })
  );
  autoUpdater.on('update-downloaded', info =>
    send({ state: 'downloaded', info })
  );
  autoUpdater.on('error', err =>
    send({ state: 'error', message: err?.message || String(err) })
  );

  // Renderer → Main commands
  ipcMain.handle('update:check', async () => {
    const res = await autoUpdater.checkForUpdates();
    return res?.updateInfo ?? null;
  });
  ipcMain.handle('update:download', async () => {
    await autoUpdater.downloadUpdate();
    return true;
  });
  ipcMain.handle('update:install', async () => {
    setImmediate(() => autoUpdater.quitAndInstall(false, true));
    return true;
  });

  // Initial background check on app start
  autoUpdater.checkForUpdates().catch(() => {});
}
