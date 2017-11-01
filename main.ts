import * as Electron from 'electron';
import * as path from 'path';
import * as url from 'url';

const app = Electron.app;
const globalShortcut = Electron.globalShortcut;
let mainWindow: Electron.BrowserWindow;

function createWindow() {
    globalShortcut.register('CommandOrControl+Q', () => {
        app.quit();
    });

    globalShortcut.register('CommandOrControl+D', () => {
        mainWindow.webContents.openDevTools();
    });

    mainWindow = new Electron.BrowserWindow({
        width: 800,
        height: 600,
        title: 'Janna',
        show: false,
        fullscreen: true,
    });
    mainWindow.setMenu(null);

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});
