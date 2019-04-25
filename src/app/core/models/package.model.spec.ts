import {
  ApiPackageVersion,
  ApiPackage,
  InstalledPackage
} from './package.model';

export const testPackageVersion: ApiPackageVersion = {
  date_created: new Date(),
  dependencies: [],
  description: '',
  download_url: '',
  downloads: 0,
  icon: '',
  is_active: true,
  name: 'testPackage',
  uuid4: '',
  version_number: '1.0.0',
  website_url: '',
  full_name: 'author-testPackage-1.0.0'
};

const _testPackage = {
  date_created: new Date(),
  date_updated: new Date(),
  is_active: true,
  is_pinned: false,
  maintainers: [],
  name: 'TestPackage',
  owner: 'author',
  uuid4: '',
  full_name: ``,
  latest_version: testPackageVersion,
  versions: [testPackageVersion]
};

export const testPackage: ApiPackage = _testPackage;

export const testInstalledPackage: InstalledPackage = Object.assign(
  {},
  _testPackage,
  { latest_version: testPackageVersion }
) as InstalledPackage;
