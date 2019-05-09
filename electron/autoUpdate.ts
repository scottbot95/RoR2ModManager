import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as logger from 'electron-log';

import { prefs } from './prefs';

logger.transports.file.level = 'debug';
autoUpdater.logger = logger;

const checkForUpdates = () => {
  autoUpdater.checkForUpdatesAndNotify();
};

if (app.isPackaged) {
  // check once now
  autoUpdater.checkForUpdatesAndNotify();

  // check every `appUpdateCheckInterval` seconds
  const period = prefs.get('appUpdateCheckInterval') as number;
  let interval = setInterval(checkForUpdates, period * 1000);

  prefs.onDidChange(
    'appUpdateCheckInterval',
    (oldVal: number, newVal: number) => {
      clearInterval(interval);
      interval = setInterval(checkForUpdates, newVal * 1000);
    }
  );
}
