import { autoUpdater, app } from 'electron';

const server = 'https://hazel.scottbot95.now.sh';
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

autoUpdater.setFeedURL({ url: feed });

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update');
});

autoUpdater.on('error', error => {
  console.error('Error during update', error.message || error);
});

autoUpdater.on('update-available', () => {
  console.log('Update available!');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded');
});

autoUpdater.on('update-not-available', () => {
  console.log('No update available');
});

autoUpdater.checkForUpdates();
