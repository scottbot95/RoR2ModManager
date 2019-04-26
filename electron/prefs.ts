import * as Store from 'electron-store';
import { preferencesSchema, defaultConfig } from './preferences.model';

export const prefs = new Store({
  name: 'user-preferences',
  defaults: defaultConfig,
  schema: preferencesSchema
});
