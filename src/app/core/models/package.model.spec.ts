import { PackageVersion, Package, InstalledPackage } from './package.model';
import { SemVer } from 'semver';

export const testPackageVersion: PackageVersion = {
  dateCreated: new Date(),
  dependencies: [],
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

export const testInstalledPackage: InstalledPackage = {
  ...testPackage,
  installedVersion: testPackageVersion
};
