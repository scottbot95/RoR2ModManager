// formattated like {author}-{packagename}-{version}
type PackageNameVersion = string;

interface PackageBase {
  name: string;
  full_name: PackageNameVersion;
  is_active: boolean;
  date_created: Date;
  uuid4: string;
}

export interface Package extends PackageBase {
  owner: string;
  maintainers: string[];
  date_updated: Date;
  is_pinned: boolean;
  versions: PackageVersion[];
}

export interface PackageVersion extends PackageBase {
  download_url: string;
  dependencies: PackageNameVersion[];
  downloads: number;
  version_number: string;
  website_url: string;
  description: string;
  readme: string;
  icon: string;
}