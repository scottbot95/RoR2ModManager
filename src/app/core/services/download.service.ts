import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { PackageVersion } from '../models/package.model';
import * as DownloadManger from 'electron-download-manager';
import { DownloadResultInfo } from '../../../../electron/downloads';

interface Download {
  promise: {
    resolve: (result: DownloadResult) => void;
    reject: Function;
  };
  pkg: PackageVersion;
}

// TODO do something better than this eventually
export type DownloadResult = string;

@Injectable()
export class DownloadService {
  private downloadManger: typeof DownloadManger;
  private downloads = new Map<string, Download>();

  constructor(private electron: ElectronService) {
    this.downloadManger = this.electron.downloadManager;
    this.electron.ipcRenderer.on(
      'download-complete',
      this.onComplete.bind(this)
    );
  }

  download(pkg: PackageVersion): Promise<DownloadResult> {
    return new Promise((resolve, reject) => {
      this.electron.ipcRenderer.send('download-package', pkg);
      this.downloads.set(pkg.uuid4, { promise: { reject, resolve }, pkg });
    });
  }

  private onComplete(
    event: Electron.Event,
    pkg: PackageVersion,
    info: DownloadResultInfo
  ) {
    const data = this.downloads.get(pkg.uuid4);
    this.downloads.delete(pkg.uuid4);
    const { state } = info;
    console.log(`Download completed for uuid ${pkg.uuid4}. State: ${state}`);

    if (state === 'completed' || state === 'cached')
      data.promise.resolve(info.filePath);
    else data.promise.reject(new Error(`Download state ${state}`));
  }
}
