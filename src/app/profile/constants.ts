export const DEFAULT_PROFILE_EXTENSION = '.json';

export const PROFILE_EXTENSIONS: Electron.FileFilter[] = [
  { name: 'Mod Profile', extensions: [DEFAULT_PROFILE_EXTENSION.slice(1)] },
  { name: 'All Files', extensions: ['*'] }
];
