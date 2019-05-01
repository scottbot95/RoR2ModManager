import * as fs from 'fs-extra';
import * as path from 'path';
import { app, BrowserWindow, Session, ipcMain } from 'electron';
import { PackageVersion } from '../src/app/core/models/package.model';

export interface DownloadRegisterOptions {
  downloadPath?: string;
}

export interface DownloadOptions {
  /** Default: true */
  useCache?: boolean;
}

const defaultRegsiterOpts: DownloadRegisterOptions = {
  downloadPath: app.getPath('downloads')
};

const defaultDownloadOpts: DownloadOptions = {
  useCache: true
};

let registeredOptions: DownloadRegisterOptions = defaultRegsiterOpts;

const downloads = new Map<string, PackageVersion>();

export const registerDownloadManager = (regOpts?: DownloadRegisterOptions) => {
  registeredOptions = Object.assign({}, defaultRegsiterOpts, regOpts);
  Session.defaultSession.setDownloadPath(registeredOptions.downloadPath);

  Session.defaultSession.on('will-download', handleWillDownload);

  ipcMain.on('download-package', handleDownload);
};

async function handleDownload(
  event: Electron.Event,
  pkg: PackageVersion,
  downloadOpts?: DownloadOptions
) {
  if (!pkg) return;
  const options = Object.assign({}, defaultDownloadOpts, downloadOpts);
  if (
    options.useCache &&
    (await fs.pathExists(
      path.join(registeredOptions.downloadPath, `${pkg.fullName}.zip`)
    ))
  ) {
    console.log(
      `${pkg.fullName}.zip already exists in cache, skipping download.`
    );
    return event.sender.send('download-complete', pkg);
  }

  downloads.set(pkg.fullName + '.zip', pkg);
  event.sender.downloadURL(pkg.downloadUrl);
}

function handleWillDownload(
  downloadEvent: Electron.Event,
  item: Electron.DownloadItem,
  webContent: Electron.webContents
) {
  console.log(item.getFilename());
  const pkg = downloads.get(item.getFilename());
  item.on('done', (event, state) => {
    webContent.send('download-complete', pkg);
  });
}
