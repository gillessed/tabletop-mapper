import * as Electron from 'electron';
import * as path from 'path';
import * as process from 'process';
import * as url from 'url';

process.setMaxListeners(0);
const app = Electron.app;
app.allowRendererProcessReuse = true;
const globalShortcut = Electron.globalShortcut;
let mainWindow: Electron.BrowserWindow;

function createWindow() {

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
  });
  
  globalShortcut.register('CommandOrControl+0', () => {
    app.quit();
  });

  globalShortcut.register('CommandOrControl+Shift+D', () => {
    for (const window of Electron.BrowserWindow.getAllWindows()) {
      window.webContents.openDevTools();
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});