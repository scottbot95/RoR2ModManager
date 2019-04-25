// formattated like {author}-{packagename}-{version}
type PackageNameVersion = string;

interface ApiPackageBase {
  name: string;
  full_name: PackageNameVersion;
  is_active: boolean;
  date_created: Date;
  uuid4: string;
}

export interface ApiPackage extends ApiPackageBase {
  owner: string;
  maintainers: string[];
  date_updated: Date;
  is_pinned: boolean;
  versions: PackageVersionList;

  // add on after getting result from api
  latest_version?: ApiPackageVersion;
  total_downloads?: number;
  selected?: boolean;
  requiredBy?: Set<ApiPackageVersion>;
}

export interface ApiPackageVersion extends ApiPackageBase {
  download_url: string;
  dependencies: PackageNameVersion[];
  downloads: number;
  version_number: string;
  website_url: string;
  description: string;
  icon: string;
  readme?: string;
  pkg?: ApiPackage;
}

export interface InstalledPackage extends ApiPackage {
  // undefined if no version is installed
  installed_version: ApiPackageVersion | undefined;
}

export type PackageList = ApiPackage[];
export type PackageVersionList = ApiPackageVersion[];
export type InstalledPackageList = InstalledPackage[];
