import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { PackageVersion } from '../models/package.model';
import { download } from 'electron-dl';
import { DownloadItem } from 'electron';

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
    console.log(directory);

    const savePath = this.electron.path.join(directory, `${pkg.fullName}.zip`);
    try {
      await this.electron.fs.promises.access(savePath);
      console.log(`Found file in cache, using it`);
      return { savePath };
    } catch (err) {}

    console.log('File not in cache, downloading', pkg.downloadUrl, directory);
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
