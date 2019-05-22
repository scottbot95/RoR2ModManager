import { Injectable } from '@angular/core';
import { ElectronService } from '../../../core/services/electron.service';
import { PreferencesService } from '../../../core/services/preferences.service';
import { Package } from '../../../core/models/package.model';
import { BEPIN_UUID4 } from '../../services/package.service';

export class ParseError extends Error {
  name = 'ParseError';
  constructor(message: string) {
    super(message);
  }
}

export type ConfigValue = number | string | boolean | ConfigMap;

export interface ConfigMapValue {
  value: ConfigValue;
  type: 'number' | 'string' | 'boolean' | 'object';
  name: string;
  description?: string;
}

export interface ConfigMap {
  [key: string]: ConfigMapValue;
}

@Injectable()
export class ConfigParserService {
  constructor(
    private electron: ElectronService,
    private prefs: PreferencesService
  ) {}

  public async parseFile(filename: string): Promise<ConfigMap> {
    const fullname = this.getConfigPath(filename);

    const rawInput = (await this.electron.fs.readFile(
      fullname,
      'utf8'
    )).replace(/^\uFEFF/, '');

    return this.parseString(rawInput);
  }

  public parseString(raw: string): ConfigMap {
    const result: ConfigMap = {};

    const sections = raw.split(/\s*(\[.*\]).*/g);

    let i = 1;
    while (i < sections.length) {
      const title = sections[i].trim().slice(1, -1);
      const body = sections[i + 1];
      let obj: ConfigMap = result;
      const keys = title.split('.');
      for (let j = 0; j < keys.length - 1; j++) {
        const key = keys[j];
        if (!obj[key]) obj[key] = { type: 'object', value: {}, name: key };

        if (obj[key].type !== 'object')
          throw new ParseError(
            `Cannot have subsection and key with same name. Existing type ${
              obj[key].type
            }`
          );

        obj = obj[key].value as ConfigMap;
      }
      obj[keys[keys.length - 1]] = {
        type: 'object',
        value: this.parseSectionBody(body),
        name: keys[keys.length - 1]
      };
      i += 2;
    }

    return result;
  }

  public async writeConfigMap(config: ConfigMap, filename: string) {
    const serialized = this.serializeConfigMap(config);
    const fullPath = this.getConfigPath(filename);

    await this.electron.fs.writeFile(fullPath, serialized);
  }

  public serializeConfigMap(config: ConfigMap): string {
    let result = '';

    for (const key of Object.keys(config)) {
      const section = config[key];
      result += this.serialzieConfigSection(section);
    }

    return result;
  }

  public serialzieConfigSection(
    section: ConfigMapValue,
    parentNames?: string
  ): string {
    if (section.type !== 'object')
      throw new Error(
        `value must be of type section. ${section.type} was provided`
      );

    const parentPrefix = parentNames ? parentNames + '.' : '';
    let result = `[${parentPrefix}${section.name}]\n\n`;
    if (section.description) {
      result = this.serializeDescription(section.description) + result;
    }
    const subSections: string[] = [];

    for (const key of Object.keys(section.value)) {
      const field = (section.value as ConfigMap)[key];
      if (field.description) {
        result += this.serializeDescription(field.description);
      }
      if (field.type !== 'object') {
        result += `${field.name} = ${field.value}\n\n`;
      } else {
        subSections.push(
          this.serialzieConfigSection(field, parentPrefix + section.name)
        );
      }
    }

    for (const sec of subSections) {
      result += sec;
    }

    return result;
  }

  serializeDescription(input: string): string {
    return input
      .split(/\n\r?/)
      .map(l => `# ${l}\n`)
      .join('');
  }

  public getConfigPath(filename?: string) {
    if (filename) {
      return this.electron.path.join(
        this.prefs.get('ror2_path'),
        'BepInEx',
        'config',
        filename
      );
    } else {
      return this.electron.path.join(
        this.prefs.get('ror2_path'),
        'BepInEx',
        'config'
      );
    }
  }

  parseSectionBody(raw: string): ConfigMap {
    const body: ConfigMap = {};
    const lines = raw
      .split(/\n\r?/)
      .map(l => l.trimLeft())
      .filter(l => l.length > 0);

    let foundDescription: string;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // if it's a comment save it for next loop
      if (line.startsWith('#')) {
        foundDescription =
          (foundDescription || '') + line.slice(1).trim() + '\n';
        continue; // next loop
      }
      const { groups } = line.match(/\s*(?<key>\w*)\s*=\s*(?<value>.*)\s*/);

      const key = groups.key;
      const rawValue = groups.value;

      if (!isNaN(+rawValue)) {
        body[key] = { type: 'number', value: +rawValue, name: key };
      } else if (
        rawValue.toLowerCase() === 'true' ||
        rawValue.toLowerCase() === 'false'
      ) {
        body[key] = {
          type: 'boolean',
          value: rawValue.toLowerCase() === 'true',
          name: key
        };
      } else {
        let str = rawValue;
        if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
          str = rawValue.slice(1, -1);
        }
        body[key] = {
          type: 'string',
          value: str,
          name: key
        };
      }

      if (foundDescription) {
        body[key].description = foundDescription.trim();
        foundDescription = undefined;
      }
    }

    return body;
  }
}

export const getPossibleConfigFilenames = (pkg: Package) => {
  const filenameBase = `${pkg.owner}.${pkg.name}.cfg`;
  if (pkg.uuid4 === BEPIN_UUID4) return ['BepInEx.cfg'];
  else return ['com', 'dev'].map(pre => `${pre}.${filenameBase}`);
};
