import { Injectable } from '@angular/core';
import { ElectronService } from '../../core/services/electron.service';
import { DialogWindowOptions } from '../../../../electron/ipc';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { WebContents } from 'electron';

@Injectable()
export class DialogService {
  private isDialog: boolean;
  private dialogIsReady = false;

  private _dialogInputSource = new Subject<any>();
  public dialogInput = this._dialogInputSource.asObservable();

  private webContents: WebContents;
  private parentWebContents: WebContents;

  constructor(private electron: ElectronService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith('/dialogs/')) {
          this.configureForDialog();
        }
      }
    });
  }

  openDialog(opts: DialogWindowOptions, dialogInput?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const webContentsId = this.electron.ipcRenderer.sendSync(
        'openDialog',
        opts
      );

      const readyHandler = (event: Electron.Event, dialogId: number) => {
        if (dialogId === webContentsId) {
          if (dialogInput) {
            this.electron.ipcRenderer.sendTo(
              webContentsId,
              'dialogInput',
              dialogInput
            );

            this.electron.ipcRenderer.removeListener(
              'dialogReady',
              readyHandler
            );
          }
        }
      };

      const closeHandler = (
        event: Electron.Event,
        dialogId: number,
        result?: any
      ) => {
        if (dialogId === webContentsId) {
          this.electron.ipcRenderer.removeListener('dialogClose', closeHandler);
          resolve(result);
        }
      };

      const errorHandler = (
        event: Electron.Event,
        dialogId: number,
        error: any
      ) => {
        if (dialogId === webContentsId) {
          this.electron.ipcRenderer.removeListener('dialogError', errorHandler);
          reject(error);
        }
      };

      this.electron.ipcRenderer.on('dialogReady', readyHandler);

      this.electron.ipcRenderer.on('dialogClose', closeHandler);

      this.electron.ipcRenderer.on('dialogError', errorHandler);
    });
  }

  public dialogReady() {
    this.checkIsDialog();
    if (!this.dialogIsReady) {
      this.electron.ipcRenderer.on(
        'dialogInput',
        (event: Electron.Event, input: any) => {
          console.log('receive dialog input');
          this._dialogInputSource.next(input);
          this._dialogInputSource.complete();
        }
      );

      this.sendToParent('dialogReady');
      this.dialogIsReady = true;
    }
  }

  public closeDialog(result?: any) {
    this.checkIsDialog();
    this.sendToParent('dialogClose', result);
    this.electron.remote.getCurrentWindow().close();
  }

  private sendToParent(channel: string, ...args: any[]) {
    this.electron.ipcRenderer.sendTo(
      this.parentWebContents.id,
      channel,
      this.webContents.id,
      ...args
    );
  }

  private checkIsDialog() {
    if (!this.isDialog) {
      throw new Error(
        'Cannot trigger dialog ready when window is not a dialog'
      );
    }
  }

  private configureForDialog() {
    this.isDialog = true;
    const win = this.electron.remote.getCurrentWindow();
    this.webContents = win.webContents;
    this.parentWebContents = win.getParentWindow().webContents;

    win.on('close', (event: Electron.Event) => {
      this.sendToParent('dialogClose');
    });
  }
}
