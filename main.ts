// tslint:disable-next-line:no-unused-variable
import { app, BrowserWindow, Notification, dialog } from 'electron';
import * as path from 'path';
import * as Registry from 'winreg';

import { UserPreferences } from './electron/preferences.model';
import { prefs } from './electron/prefs';
import { name, protocols } from './package.json';
import { configureApplicationMenu } from './electron/menu';
import { registerIpcListeners } from './electron/ipc';
import { createBrowserWindow } from './electron/windows';
import { registerDownloadManager } from './electron/downloads';

import './electron/autoUpdate';
import { log } from 'electron-log';

app.setAppUserModelId('com.electron.ror2modmanager');

registerIpcListeners();
registerDownloadManager({
  downloadPath: path.join(app.getPath('userData'), 'downloadCache')
});

let win: BrowserWindow, serve: boolean;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

const regKey = new Registry({
  hive: Registry.HKLM,
  key: `\\SOFTWARE\\${name}`
});

// Grab value out of registry
regKey.get('RoR2Dir', (err, result) => {
  if (!err) {
    // save it to prefs
    prefs.set('ror2_path', result.value);
  } else if (
    err.message.endsWith(
      'The system was unable to find the specified registry key or value.'
    ) &&
    prefs.get('ror2_path') === ''
  ) {
    // installer goofed somehow
    dialog.showErrorBox(
      'Cannot read registry',
      'Failed to read Risk of Rain 2 install folder.\n\n' +
        'Please set manually in preferences'
    );
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
  win = createBrowserWindow({
    x,
    y,
    width,
    height
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
    const watch = require('electron-reload');
    const options = {
      electron: require(path.join(__dirname, 'node_modules', 'electron')),
      argv: ['--serve']
    };
    watch(__dirname, options);
    watch(path.join(__dirname, 'electron'), options);
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
        const othersArgs = argv.slice(-1);
        if (canHandleProtocol(othersArgs[0])) {
          if (win.isMinimized()) win.restore(); // restore seems to be broken
          win.focus();
          log(`Loading url ${othersArgs[0]}`);
          win.webContents.loadURL(othersArgs[0]);
        }
      }
    });

    configureApplicationMenu();

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
