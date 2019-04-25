import { SemVer } from 'semver';
// formattated like {author}-{packagename}-{version}
type PackageNameVersion = string;

interface SerializablePackageBase {
  name: string;
  full_name: PackageNameVersion;
  is_active: boolean;
  date_created: string;
  uuid4: string;
}

export interface SerializablePackage extends SerializablePackageBase {
  owner: string;
  maintainers: string[];
  date_updated: string;
  is_pinned: boolean;
  versions: ApiPackageVersionList;
}

export interface SerializablePackageVersion extends SerializablePackageBase {
  download_url: string;
  dependencies: PackageNameVersion[];
  downloads: number;
  version_number: string;
  website_url: string;
  description: string;
  icon: string;
  readme?: string;
}

// eventually might have changes so leave this empty interface here
// tslint:disable-next-line: no-empty-interface
interface PackageBase {
  name: string;
  fullName: string;
  isActive: boolean;
  dateCreated: Date;
  uuid4: string;
}

export interface Package extends PackageBase {
  owner: string;
  maintainers: string[];
  dateUpdated: Date;
  isPinned: boolean;
  versions: PackageVersionList;
  latestVersion: PackageVersion;
  totalDownloads: number;
  requiredBy: Set<PackageVersion>;

  selected?: boolean;
}

export interface PackageVersion extends PackageBase {
  downloadUrl: string;
  dependencies: PackageVersionList;
  downloads: number;
  versionNumber: SemVer;
  websiteUrl: string;
  description: string;
  icon: string;
  pkg: Package;
  readme?: string; // this used to be in thunderstore API. Hoping they bring it back
}

export interface InstalledPackage extends Package {
  // undefined if no version is installed
  installedVersion: PackageVersion | undefined;
}

export type ApiPackageList = SerializablePackage[];
export type ApiPackageVersionList = SerializablePackageVersion[];
export type PackageList = Package[];
export type PackageVersionList = PackageVersion[];
export type InstalledPackageList = InstalledPackage[];
