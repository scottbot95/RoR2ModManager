import * as Store from 'electron-store';
import { defaultConfig, preferencesSchema } from './preferences.model';

let store: Store;

store = new Store({
  name: 'user-preferences',
  defaults: defaultConfig,
  schema: preferencesSchema
});

export const prefs = store;
