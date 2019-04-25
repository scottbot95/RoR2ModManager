import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { PackageVersion } from '../models/package.model';
import { download } from 'electron-dl';
import { DownloadItem } from 'electron';

@Injectable()
export class DownloadService {
  private downloader: typeof download;

  constructor(private electron: ElectronService) {
    this.downloader = this.electron.download;
  }

  async download(pkg: PackageVersion): Promise<DownloadItem> {
    // check if file exists in cache already
    const result = await this.downloader(
      this.electron.remote.getCurrentWindow(),
      pkg.downloadUrl,
      {
        directory: this.electron.remote.app.getPath('downloads'),
        onProgress: percent => {
          console.log(percent);
        }
      }
    );

    return result;
  }
}
