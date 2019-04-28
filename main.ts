import { app, BrowserWindow, autoUpdater } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import * as Registry from 'winreg';
import { register } from 'electron-download-manager';

import { UserPreferences } from './electron/preferences.model';
import { prefs } from './electron/prefs';
import { name, protocols } from './package.json';

const server = 'https://hazel.scottbot95.now.sh';
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

autoUpdater.setFeedURL({ url: feed });

register({
  downloadFolder: path.join(app.getPath('userData'), 'downloadCache')
});

let win: BrowserWindow, serve: boolean;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

const regKey = new Registry({
  hive: Registry.HKCU,
  key: `\\SOFTWARE\\${name}`
});

// Grab value out of registry
regKey.get('RoR2Dir', (err, result) => {
  if (!err) {
    // save it to prefs
    prefs.set('ror2_path', result.value);

    // leave it in registry in case we reinstall
  }
});

function canHandleProtocol(url: string) {
  if (typeof url !== 'string') return false;
  return protocols.some(p => url.startsWith(`${p}://`));
}

function createWindow() {
  const { height, width, x, y } = <UserPreferences['windowBounds']>(
    prefs.get('windowBounds')
  );

  // Create the browser window.
  win = new BrowserWindow({
    x,
    y,
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: false
    }
  });

  if (prefs.get('windowMaximized')) {
    win.maximize();
  }

  win.on('resize', () => {
    if (win.isMaximized()) return;
    const bounds = win.getBounds();
    prefs.set('windowBounds', bounds);
  });

  win.on('move', () => {
    if (win.isMaximized()) return;
    const bounds = win.getBounds();
    prefs.set('windowBounds', bounds);
  });

  win.on('maximize', () => {
    prefs.set('windowMaximized', true);
  });

  win.on('unmaximize', () => {
    prefs.set('windowMaximized', false);
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, 'node_modules', 'electron')),
      argv: ['--serve']
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {
  // ensure there is only one window open at a time
  const gotLock = app.requestSingleInstanceLock();
  if (!gotLock) {
    app.quit();
  } else {
    app.on('second-instance', (event, argv, workingDir) => {
      if (win) {
        if (win.isMinimized) win.restore(); // restore seems to be broken
        if (canHandleProtocol(argv[1])) {
          win.webContents.loadURL(argv[1]);
        }
      }
    });

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (win === null) {
        createWindow();
      }
    });
  }
} catch (e) {
  // Catch Error
  // throw e;
}
