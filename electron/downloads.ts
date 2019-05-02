import * as fs from 'fs-extra';
import * as path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { PackageVersion } from '../src/app/core/models/package.model';

export interface DownloadRegisterOptions {
  downloadPath?: string;
}

export interface DownloadOptions {
  /** Default: true */
  useCache?: boolean;
}

export type DownloadState =
  | 'completed'
  | 'cancelled'
  | 'interrupted'
  | 'cached';
export interface DownloadResultInfo {
  state: DownloadState;
  filePath: string;
}

const defaultRegsiterOpts: DownloadRegisterOptions = {
  downloadPath: app.getPath('downloads')
};

const defaultDownloadOpts: DownloadOptions = {
  useCache: true
};

let registeredOptions: DownloadRegisterOptions = defaultRegsiterOpts;

const downloads = new Map<string, PackageVersion>();

const regsiterListener = (
  win: BrowserWindow,
  opts: DownloadRegisterOptions
) => {
  registeredOptions = Object.assign({}, defaultRegsiterOpts, opts);
  const { session } = win.webContents;
  session.setDownloadPath(registeredOptions.downloadPath);

  session.on('will-download', handleWillDownload);

  ipcMain.on('download-package', handleDownload);
};

export const registerDownloadManager = (
  regOpts: DownloadRegisterOptions = {}
) => {
  app.on('browser-window-created', (event, win) => {
    regsiterListener(win, regOpts);
  });
};

async function handleDownload(
  event: Electron.Event,
  pkg: PackageVersion,
  downloadOpts?: DownloadOptions
) {
  if (!pkg) return;
  const options = Object.assign({}, defaultDownloadOpts, downloadOpts);
  const filePath = path.join(
    registeredOptions.downloadPath,
    `${pkg.fullName}.zip`
  );
  if (options.useCache && (await fs.pathExists(filePath))) {
    console.log(
      `${pkg.fullName}.zip already exists in cache, skipping download.`
    );
    return sendDownloadComplete('cached', filePath, pkg, event.sender);
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
  item.setSavePath(
    path.join(registeredOptions.downloadPath, item.getFilename())
  );
  const pkg = downloads.get(item.getFilename());
  const filePath = path.join(
    registeredOptions.downloadPath,
    item.getFilename()
  );
  item.on('done', (event, state) => {
    sendDownloadComplete(state, filePath, pkg, webContent);
  });
}

function sendDownloadComplete(
  state: DownloadState,
  filePath: string,
  pkg: PackageVersion,
  webContent: Electron.WebContents
) {
  const result: DownloadResultInfo = {
    state,
    filePath
  };
  webContent.send('download-complete', pkg, result);
}
