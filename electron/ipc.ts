import { ipcMain, BrowserWindow, screen } from 'electron';
import { createBrowserWindow } from './windows';

export interface DialogWindowOptions {
  slug: string;
  modal?: boolean;
  width?: number;
  height?: number;
  maximizable?: boolean;
}

export const registerIpcListeners = () => {
  ipcMain.on(
    'openDialog',
    (event: Electron.Event, opts: DialogWindowOptions) => {
      if (!opts.slug)
        // tslint:disable-next-line: quotemark
        return event.sender.send('print', "Can't  display dialog with no slug");
      const win = BrowserWindow.fromWebContents(event.sender);
      const display = screen.getPrimaryDisplay();
      const width = opts.width || 400;
      const height = opts.height || 600;
      createBrowserWindow(
        {
          parent: win,
          x: (display.bounds.width - width) / 2,
          y: (display.bounds.height - height) / 2,
          width,
          height,
          modal: opts.modal,
          autoHideMenuBar: true,
          minimizable: false,
          maximizable: opts.maximizable
        },
        `/dialogs/${opts.slug}`
      );
    }
  );
};
