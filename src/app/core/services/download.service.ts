import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { PackageVersion } from '../models/package.model';
import * as DownloadManger from 'electron-download-manager';

// TODO do something better than this eventually
export type DownloadResult = string;

@Injectable()
export class DownloadService {
  private downloadManger: typeof DownloadManger;

  constructor(private electron: ElectronService) {
    this.downloadManger = this.electron.downloadManager;
  }

  download(pkg: PackageVersion): Promise<DownloadResult> {
    return new Promise((resolve, reject) => {
      this.downloadManger.download({ url: pkg.downloadUrl }, (err, info) => {
        if (err) reject(err);
        else resolve(info.filePath);
      });
    });
  }
}
