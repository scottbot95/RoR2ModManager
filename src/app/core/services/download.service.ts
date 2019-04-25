import { Injectable } from '@angular/core';
import * as nodeFs from 'fs';
import { ElectronService } from './electron.service';
import { PackageVersion } from '../models/package.model';
import { download } from 'electron-dl';

// make our own function to avoid the error print in console from node
// fs.promises is 'experimental'
const accessP = (fs: typeof nodeFs, path: string) => {
  return new Promise<void>((resolve, reject) => {
    fs.access(path, err => {
      if (err) reject(err);
      else resolve();
    });
  });
};
export class DownloadResult {
  savePath: string;
}

@Injectable()
export class DownloadService {
  private downloader: typeof download;

  constructor(private electron: ElectronService) {
    this.downloader = this.electron.download;
  }

  async download(pkg: PackageVersion): Promise<DownloadResult> {
    // check if file exists in cache already
    const directory = this.electron.path.join(
      this.electron.remote.app.getPath('userData'),
      'downloadCache'
    );

    const savePath = this.electron.path.join(directory, `${pkg.fullName}.zip`);
    try {
      await accessP(this.electron.fs, savePath);
      return { savePath };
    } catch (err) {}

    await this.downloader(
      this.electron.remote.getCurrentWindow(),
      pkg.downloadUrl,
      {
        saveAs: false,
        directory // this seems to be bugged see https://github.com/sindresorhus/electron-dl/issues/78
      }
    );

    return { savePath };
  }
}
