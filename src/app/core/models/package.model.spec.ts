import { PackageVersion, Package, InstalledPackage } from './package.model';
import { SemVer } from 'semver';

const foo = '4c253b36-fd0b-4e6d-b4d8-b227972af4da';
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
  versionNumber: new SemVer('1.0.0'),
  websiteUrl: '',
  fullName: 'bbepis-BepInExPack-1.0.0',
  pkg: undefined
};

export const testBepInExPackPackage = {
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
  totalDownloads: 0,
  requiredBy: new Set()
};

testBepInExPackPackageVersion.pkg = testBepInExPackPackage;

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
  versionNumber: new SemVer('1.0.0'),
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
  totalDownloads: 0,
  requiredBy: new Set()
};

testPackageVersion.pkg = testPackage;

export const testInstalledPackage: InstalledPackage = {
  ...testPackage,
  installedVersion: testPackageVersion
};
