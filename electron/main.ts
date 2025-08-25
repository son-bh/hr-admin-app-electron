import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import { join } from 'node:path';
import { registerIpcHandlers } from './ipcHandlers';
import { setupAutoUpdate } from './setupAutoUpdate';

const isDev = !app.isPackaged;

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow: BrowserWindow | null = null;
const getWindow = () => mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../dist-electron/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev && VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    await mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }

  setupAutoUpdate(getWindow);

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window finished loading');
  });
  mainWindow.webContents.on(
    'did-fail-load',
    (event, errorCode, errorDescription, validatedURL) => {
      console.error(
        'Window failed to load:',
        errorCode,
        errorDescription,
        validatedURL
      );
    }
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
