import { Menu, BrowserWindow, shell } from 'electron';
import openAboutWindow from 'about-window';
import * as path from 'path';
import { prefs } from './prefs';

const openRoR2Directory = (dir: string = '') => {
  const openPath = path.join(prefs.get('ror2_path') as string, dir);
  return () => shell.openItem(openPath);
};

const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [{ role: 'quit' }]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Profile',
    submenu: [
      {
        label: 'Import',
        click: () =>
          BrowserWindow.getFocusedWindow().webContents.send('importProfile')
      },
      {
        label: 'Export',
        click: () =>
          BrowserWindow.getFocusedWindow().webContents.send('exportProfile')
      }
    ]
  },
  {
    label: 'Directories',
    submenu: [
      { label: 'Risk of Rain 2 Install', click: openRoR2Directory() },
      {
        label: 'BepInEx',
        submenu: [
          { label: 'Main Directory', click: openRoR2Directory('BepInEx') },
          {
            label: 'Config Directory',
            click: openRoR2Directory('BepInEx/config')
          },
          {
            label: 'Plugins Directory',
            click: openRoR2Directory('BepInEx/plugins')
          }
        ]
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        role: 'about',
        click: () => {
          openAboutWindow({
            icon_path: path.join(__dirname, '../dist/favicon.png'),
            package_json_dir: path.join(__dirname, '..'),
            win_options: { autoHideMenuBar: true }
          });
        }
      }
    ]
  }
];

export const configureApplicationMenu = () => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return menu;
};
