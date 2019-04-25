import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { download } from 'electron-dl';
import * as path from 'path';

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  download: typeof download;
  path: typeof path;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');

      this.download = this.remote.require('electron-dl').download;
      this.path = this.remote.require('path');

      this.configureIpc();
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  private configureIpc() {
    this.ipcRenderer.on('print', (event, ...args) => {
      console.log('Main Process:', ...args);
    });
  }
}
