import { Menu } from 'electron';
import openAboutWindow from 'about-window';
import * as path from 'path';

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
