import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, protocol, screen } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as unzipper from 'unzipper';
import * as glob from 'glob';

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  screen: typeof screen;
  webFrame: typeof webFrame;
  remote: typeof remote;
  protocol: typeof protocol;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;
  unzipper: typeof unzipper;
  glob: typeof glob;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.screen = window.require('electron').screen;

      this.protocol = this.remote.protocol;

      this.childProcess = window.require('child_process');

      this.fs = this.remote.require('fs-extra');
      this.path = this.remote.require('path');
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
}
