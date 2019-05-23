import { ipcMain, BrowserWindow, protocol } from 'electron';
import { createBrowserWindow, getUrl } from './windows';
import { log } from 'electron-log';

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

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
      const bounds = win.getBounds();
      const width = opts.width || 400;
      const height = opts.height || 600;
      const dialog = createBrowserWindow(
        {
          parent: win,
          x: bounds.x + (bounds.width - width) / 2,
          y: bounds.y + (bounds.height - height) / 2,
          width,
          height,
          modal: opts.modal,
          autoHideMenuBar: true,
          minimizable: false,
          maximizable: opts.maximizable || false
        },
        `/dialogs/${opts.slug}`
      );
      event.returnValue = dialog.webContents.id;
      if (serve) {
        dialog.webContents.openDevTools();
      }
    }
  );

  ipcMain.on('registerHttp', (event: Electron.Event, scheme: string) => {
    protocol.registerFileProtocol(scheme, (req, cb) => {
      event.sender.send(scheme, req.url);
      log(`Handled event for scheme: '${scheme}'.`);
    });
  });
};
