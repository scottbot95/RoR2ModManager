import { BrowserWindow } from 'electron';
import { format } from 'url';

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

export const createBrowserWindow = (
  opts: Electron.BrowserWindowConstructorOptions,
  slug?: string
): BrowserWindow => {
  const defaultOpts: Electron.BrowserWindowConstructorOptions = {
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: false
    }
  };
  const options = { ...defaultOpts, ...opts };
  const win = new BrowserWindow(options);

  if (serve) {
    win.loadURL(`http://localhost:4200/#/${slug || ''}`);
  } else {
    win.loadURL(
      format({
        pathname: `${__dirname}/../dist/index.html`,
        protocol: 'file',
        slashes: true,
        hash: slug || '/'
      })
    );
  }

  return win;
};
