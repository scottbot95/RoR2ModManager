import * as Store from 'electron-store';
import * as Registry from 'winreg';
import { preferencesSchema, defaultConfig } from './preferences.model';
import { productName } from '../../electron-builder.json';

const regKey = new Registry({
  hive: Registry.HKCU,
  key: `\\SOFTWARE\\${productName}`
});

regKey.values((err, items) => {
  if (err) {
    console.error('Failed to read registry');
    console.error(err);
  } else {
    items.forEach(item => {
      console.log(`ITEM:${item.name}\t${item.type}\t${item.value}`);
    });
  }
});

export const prefs = new Store({
  name: 'user-preferences',
  defaults: defaultConfig,
  schema: preferencesSchema
});

// Grab value out of registry
regKey.get('RoR2Dir', (err, result) => {
  if (!err) {
    // save it to prefs
    prefs.set('ror2_path', result.value);

    // remove it from registry as we'll use the pref from here on out
    regKey.destroy(err2 => {
      if (err2) {
        console.error(
          `Failed to remove registry key ${regKey.hive}${regKey.key}`
        );
      }
    });
  }
});
