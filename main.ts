import * as Electron from 'electron';
import * as path from 'path';
import * as process from 'process';
import * as url from 'url';

process.setMaxListeners(0);
const app = Electron.app;
const globalShortcut = Electron.globalShortcut;
let mainWindow: Electron.BrowserWindow;

function createWindow() {
  globalShortcut.register('CommandOrControl+Q', () => {
    app.quit();
  });

  globalShortcut.register('CommandOrControl+D', () => {
    mainWindow.webContents.toggleDevTools();
  });

  mainWindow = new Electron.BrowserWindow({
    title: 'Tabletop Mapper',
    show: false,
    webPreferences: {
      nodeIntegration: true
    },
  });
  mainWindow.setMenu(null);
  mainWindow.maximize();

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.openDevTools();
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
