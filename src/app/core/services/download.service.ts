import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { PackageVersion } from '../models/package.model';

@Injectable()
export class DownloadService {
  constructor(private electron: ElectronService) {
    this.electron.ipcRenderer.on('print', (event, ...args) => {
      console.log(...args);
    });
  }

  download(pkg: PackageVersion) {
    this.electron.ipcRenderer.send('download', {
      url: pkg.download_url,
      directory: this.electron.remote.app.getPath('downloads')
    });
  }
}
