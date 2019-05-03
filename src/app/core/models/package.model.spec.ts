import {
  PackageVersion,
  Package,
  parseDependencyString,
  deserializablePackageList as deserializePackageList,
  SerializedPackage,
  serializePackage,
  serializePackageList,
  SerializedPackageList
} from './package.model';

import * as PackageModel from './package.model';

import { SemVer } from 'semver';
import { deepObjectContaining } from '../../../helpers.spec';

export const testBepInExPackPackageVersion: PackageVersion = {
  dateCreated: new Date(),
  dependencies: [],
  description: '',
  downloadUrl: '',
  downloads: 0,
  icon: '',
  isActive: true,
  name: 'BepInExPack',
  uuid4: '',
  version: new SemVer('1.0.0'),
  websiteUrl: '',
  fullName: 'bbepis-BepInExPack-1.0.0',
  pkg: undefined
};

export const testBepInExPackPackage: Package = {
  dateCreated: new Date(),
  dateUpdated: new Date(),
  isActive: true,
  isPinned: false,
  maintainers: [],
  name: 'BepInExPack',
  owner: 'bbepis',
  uuid4: '4c253b36-fd0b-4e6d-b4d8-b227972af4da',
  fullName: 'bbepis-BepInExPack',
  latestVersion: testBepInExPackPackageVersion,
  versions: [testBepInExPackPackageVersion],
  packageUrl: 'https://thunderstore.io/package/bbepis/BepInExPack/',
  totalDownloads: 0,
  requiredBy: new Set(),
  installedVersion: testBepInExPackPackageVersion
};

testBepInExPackPackageVersion.pkg = testBepInExPackPackage;

const testSerializedBepInExPack: SerializedPackage = {
  date_created: testBepInExPackPackage.dateCreated.toISOString(),
  date_updated: testBepInExPackPackage.dateUpdated.toISOString(),
  full_name: testBepInExPackPackage.fullName,
  is_active: testBepInExPackPackage.isActive,
  is_pinned: testBepInExPackPackage.isPinned,
  maintainers: [],
  name: testBepInExPackPackage.name,
  owner: testBepInExPackPackage.owner,
  uuid4: testBepInExPackPackage.uuid4,
  package_url: testBepInExPackPackage.packageUrl,
  installed_version: testBepInExPackPackage.installedVersion.version.version,
  versions: [
    {
      date_created: testBepInExPackPackageVersion.dateCreated.toISOString(),
      dependencies: [],
      description: testBepInExPackPackageVersion.description,
      download_url: testBepInExPackPackageVersion.downloadUrl,
      downloads: testBepInExPackPackageVersion.downloads,
      full_name: testBepInExPackPackageVersion.fullName,
      icon: testBepInExPackPackageVersion.icon,
      is_active: testBepInExPackPackageVersion.isActive,
      name: testBepInExPackPackageVersion.name,
      uuid4: testBepInExPackPackageVersion.uuid4,
      version_number: testBepInExPackPackageVersion.version.version,
      website_url: testBepInExPackPackageVersion.websiteUrl
    }
  ]
};

export const testPackageVersion: PackageVersion = {
  dateCreated: new Date(),
  dependencies: [testBepInExPackPackageVersion],
  description: '',
  downloadUrl: '',
  downloads: 0,
  icon: '',
  isActive: true,
  name: 'testPackage',
  uuid4: '',
  version: new SemVer('1.0.0'),
  websiteUrl: '',
  fullName: 'author-testPackage-1.0.0',
  pkg: undefined
};

export const testPackage: Package = {
  dateCreated: new Date(),
  dateUpdated: new Date(),
  isActive: true,
  isPinned: false,
  maintainers: [],
  name: 'TestPackage',
  owner: 'author',
  uuid4: '',
  fullName: 'author-TestPackage',
  latestVersion: testPackageVersion,
  versions: [testPackageVersion],
  packageUrl: 'https://thunderstore.io/package/author/TestPackage/',
  totalDownloads: 0,
  requiredBy: new Set()
};

testPackageVersion.pkg = testPackage;

const testSerializedPackage: SerializedPackage = {
  date_created: testPackage.dateCreated.toISOString(),
  date_updated: testPackage.dateUpdated.toISOString(),
  full_name: testPackage.fullName,
  is_active: testPackage.isActive,
  is_pinned: testPackage.isPinned,
  maintainers: [],
  name: testPackage.name,
  owner: testPackage.owner,
  uuid4: testPackage.uuid4,
  package_url: testPackage.packageUrl,
  versions: [
    {
      date_created: testPackageVersion.dateCreated.toISOString(),
      dependencies: testPackageVersion.dependencies.map(dep => dep.fullName),
      description: testPackageVersion.description,
      download_url: testPackageVersion.downloadUrl,
      downloads: testPackageVersion.downloads,
      full_name: testPackageVersion.fullName,
      icon: testPackageVersion.icon,
      is_active: testPackageVersion.isActive,
      name: testPackageVersion.name,
      uuid4: testPackageVersion.uuid4,
      version_number: testPackageVersion.version.version,
      website_url: testPackageVersion.websiteUrl
    }
  ]
};

describe('Package Model', () => {
  describe('parseDependencyString', () => {
    const testParser = (owner: string, name: string, versionNumber: string) => {
      const result = parseDependencyString(`${owner}-${name}-${versionNumber}`);

      expect(result).toEqual({ owner, name, versionNumber });
    };

    it('parses a simple string', () => {
      testParser('owner', 'packageName', '1.0.0');
    });

    it('parses a more complex string', () => {
      testParser('i-have-Dashs', 'package_nameWithWeirndess', '1.0.0');
    });
  });

  describe('deserializePackageList', () => {
    it('works on an empty list', () => {
      const result = deserializePackageList([]);
      expect(result).toBeTruthy();
    });

    it('deserializes a simple list', () => {
      const result = deserializePackageList([testSerializedBepInExPack]);
      expect(result).toEqual([testBepInExPackPackage]);
    });

    it('deserialized a package list with dependencies', () => {
      const result = deserializePackageList([
        testSerializedBepInExPack,
        testSerializedPackage
      ]);

      expect(result).toEqual([testBepInExPackPackage, testPackage]);
    });
  });

  describe('serializePackageList', () => {
    let spy: jasmine.Spy;
    const expectedResults: SerializedPackageList = [
      testSerializedBepInExPack,
      testSerializedPackage
    ];
    beforeEach(() => {
      spy = spyOn(PackageModel, 'serializePackage').and.returnValues(
        ...expectedResults
      );
    });

    it('serializes an empy list', () => {
      const result = serializePackageList([]);
      expect(result).toEqual([]);
    });

    it('serializes a list of packages', () => {
      // input just needs to be correct length due to spy
      const result = serializePackageList(expectedResults.map(_ => null));
      expect(spy).toHaveBeenCalledTimes(expectedResults.length);
      expect(result).toEqual(expectedResults);
    });
  });

  describe('serializePackage', () => {
    it('throws if bad args', () => {
      expect(() => {
        serializePackage(null);
      }).toThrow();
    });

    it('serializes a package with dependencies', () => {
      const result = serializePackage(testPackage);
      const expected = deepObjectContaining(testSerializedPackage);
      expect(result).toEqual(expected);
    });

    it('serializes an installed package', () => {
      const result = serializePackage(testBepInExPackPackage);
      const expected = deepObjectContaining(testSerializedBepInExPack);
      expect(result).toEqual(expected);
    });
  });
});
