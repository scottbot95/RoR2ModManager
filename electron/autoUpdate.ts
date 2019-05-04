import { autoUpdater } from 'electron-updater';
import * as logger from 'electron-log';

logger.transports.file.level = 'debug';
autoUpdater.logger = logger;
autoUpdater.checkForUpdatesAndNotify();
