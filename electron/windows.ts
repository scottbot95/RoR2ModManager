import { BrowserWindow } from 'electron';
import { format } from 'url';
import { log } from 'electron-log';

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

export const getUrl = (slug?: string): string => {
  if (serve) {
    return `http://localhost:4200/#/${slug || ''}`;
  } else {
    return format({
      pathname: `${__dirname}/../dist/index.html`,
      protocol: 'file',
      slashes: true,
      hash: slug || '/'
    });
  }
};

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

  const url = getUrl(slug);
  log(`Creating window with url ${url}`);
  win.loadURL(url);

  return win;
};
