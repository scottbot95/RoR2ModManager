import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, protocol, screen } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as unzipper from 'unzipper';
import * as glob from 'glob';

export interface ConfirmBoxOptions {
  message: string;
  title?: string;
  confirm?: string;
  cancel?: string;
  type?: 'none' | 'info' | 'question' | 'warning' | 'error';
}

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

  private _glob: typeof glob;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.protocol = this.remote.protocol;
      this.screen = this.remote.screen;

      this.childProcess = window.require('child_process');

      this.fs = this.remote.require('fs-extra');
      this.path = this.remote.require('path');
      this.unzipper = this.remote.require('unzipper');
      this._glob = this.remote.require('glob');

      this.configureIpc();
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };

  showMessageBox(
    opts: Electron.MessageBoxOptions,
    callback?: (res: number, checked: boolean) => void
  ) {
    const win = this.remote.getCurrentWindow();
    if (callback) {
      return this.remote.dialog.showMessageBox(win, opts, callback);
    } else {
      return this.remote.dialog.showMessageBox(win, opts);
    }
  }

  glob = (pattern: string, opts?: glob.IOptions): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      this._glob(pattern, opts, (err, matches) => {
        if (err) {
          reject(err);
        } else {
          resolve(matches);
        }
      });
    });
  };

  showConfirmBox(
    opts: ConfirmBoxOptions,
    callback?: (confirmed: boolean) => void
  ) {
    const defaultOpts: ConfirmBoxOptions = {
      message: '',
      title: 'Are you sure?',
      confirm: 'Yes',
      cancel: 'No',
      type: 'question'
    };
    const options = { ...defaultOpts, ...opts };
    const messageBoxOpts: Electron.MessageBoxOptions = {
      title: options.title,
      message: options.message,
      buttons: [options.confirm, options.cancel],
      type: options.type
    };
    if (callback) {
      this.showMessageBox(messageBoxOpts, clicked => callback(clicked === 0));
    } else {
      const clicked = this.showMessageBox(messageBoxOpts);
      return clicked === 0;
    }
  }

  private configureIpc() {
    this.ipcRenderer.on('print', (event: any, ...args: any) => {
      console.log('Main Process:', ...args);
    });
  }
}
