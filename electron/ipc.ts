import { ipcMain, BrowserWindow, screen } from 'electron';
import { createBrowserWindow } from './windows';

export const registerIpcListeners = () => {
  ipcMain.on(
    'openDialog',
    (event: Electron.Event, dialogSlug: string, modal?: boolean) => {
      if (!dialogSlug)
        // tslint:disable-next-line: quotemark
        return event.sender.send('print', "Can't  display dialog with no slug");
      const win = BrowserWindow.fromWebContents(event.sender);
      const display = screen.getPrimaryDisplay();
      const width = 400;
      const height = 600;
      createBrowserWindow(
        {
          parent: win,
          x: (display.bounds.width - width) / 2,
          y: (display.bounds.height - height) / 2,
          width,
          height,
          modal,
          autoHideMenuBar: true,
          minimizable: false,
          maximizable: false
        },
        `/dialogs/${dialogSlug}`
      );
    }
  );
};
