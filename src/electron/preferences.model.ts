import { JSONSchema } from 'json-schema-typed';

export interface UserPreferences {
  windowBounds: { width: number; height: number; x: number; y: number };
  windowMaximized?: boolean;
  darkMode?: boolean;
  ror2_path?: string;
  respectPinned: boolean;
  humanizePackageNames: boolean;
}

interface SchemaItem {
  [key: string]: JSONSchema;
}
interface Schema {
  [key: string]: JSONSchema & SchemaItem;
}

export const preferencesSchema = <Schema>{
  windowBounds: {
    type: 'object',
    width: {
      type: 'number',
      minimum: 0
    },
    height: {
      type: 'number',
      minimum: 0
    },
    x: {
      type: 'number',
      minimum: 0
    },
    y: {
      type: 'number',
      minimum: 0
    }
  },
  windowMaximized: {
    type: 'boolean'
  },
  ror2_path: {
    type: 'string'
  },
  darkMode: {
    type: 'boolean'
  }
};

export const defaultConfig: UserPreferences = {
  windowBounds: { width: 800, height: 600, x: 0, y: 0 },
  respectPinned: true,
  humanizePackageNames: true
};
