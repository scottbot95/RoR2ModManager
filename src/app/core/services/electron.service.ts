import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, protocol } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as DownloadManager from 'electron-download-manager';
import * as unzipper from 'unzipper';
import * as glob from 'glob';

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  protocol: typeof protocol;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;
  downloadManager: typeof DownloadManager;
  unzipper: typeof unzipper;
  glob: typeof glob;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.protocol = this.remote.protocol;

      this.childProcess = window.require('child_process');

      this.fs = this.remote.require('fs-extra');
      this.path = this.remote.require('path');
      this.downloadManager = this.remote.require('electron-download-manager');
      this.unzipper = this.remote.require('unzipper');
      this.glob = this.remote.require('glob');

      this.configureIpc();
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  private configureIpc() {
    this.ipcRenderer.on('print', (event: any, ...args: any) => {
      console.log('Main Process:', ...args);
    });
  }

  private deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fs.lstat(filePath, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') return resolve();
          else return reject(err);
        }
        if (stats.isDirectory()) {
          resolve(this.deleteDirectory(filePath));
        } else {
          this.fs.unlink(filePath, err2 => {
            if (err2) {
              return reject(err2);
            }
            resolve();
          });
        }
      });
    });
  }

  private deleteDirectory(dir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fs.access(dir, err => {
        if (err) {
          if (err.code === 'ENOENT') return resolve();
          else return reject(err);
        }
        this.fs.readdir(dir, (err2, files) => {
          if (err2) {
            return reject(err2);
          }
          Promise.all(
            files.map(file => {
              return this.deleteFile(this.path.join(dir, file));
            })
          )
            .then(() => {
              this.fs.rmdir(dir, err3 => {
                if (err3) {
                  return reject(err3);
                }
                resolve();
              });
            })
            .catch(reject);
        });
      });
    });
  }
}
