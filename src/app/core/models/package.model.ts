import { SemVer, satisfies } from 'semver';
// formattated like {author}-{packagename}-{version}
type PackageNameVersion = string;

interface SerializablePackageBase {
  name: string;
  full_name: PackageNameVersion;
  is_active: boolean;
  date_created: string;
  uuid4: string;
}

export interface SerializedPackage extends SerializablePackageBase {
  owner: string;
  maintainers: string[];
  date_updated: string;
  is_pinned: boolean;
  package_url: string;
  versions: SerializedPackageVersionList;
  installed_version?: string;
}

export interface SerializedPackageVersion extends SerializablePackageBase {
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
class PackageBase {
  name: string;
  fullName: string;
  isActive: boolean;
  dateCreated: Date;
  uuid4: string;
}

export class Package extends PackageBase {
  owner: string;
  maintainers: string[];
  dateUpdated: Date;
  isPinned: boolean;
  packageUrl: string;
  versions: PackageVersionList;
  latestVersion: PackageVersion;
  totalDownloads: number;
  requiredBy: Set<PackageVersion>;

  installedVersion?: PackageVersion;
}

export class PackageVersion extends PackageBase {
  downloadUrl: string;
  dependencies: PackageVersionList;
  downloads: number;
  version: SemVer;
  websiteUrl: string;
  description: string;
  icon: string;
  pkg: Package;
  readme?: string; // this used to be in thunderstore API. Hoping they bring it back
}

export class InstalledPackage extends Package {
  // undefined if no version is installed
  installedVersion: PackageVersion | undefined;
}

export type SerializedPackageList = SerializedPackage[];
export type SerializedPackageVersionList = SerializedPackageVersion[];
export type PackageList = Package[];
export type PackageVersionList = PackageVersion[];

export const parseDependencyString = (str: string) => {
  const chunks = str.split('-');
  const owner = chunks.slice(0, chunks.length - 2).join('-');
  const name = chunks[chunks.length - 2];
  const versionNumber = chunks[chunks.length - 1];
  return { owner, name, versionNumber };
};

export const deserializablePackageList = (
  serializedPackages: SerializedPackageList
): PackageList => {
  const packages = serializedPackages.map(serializedPkg => {
    let totalDownloads = 0;
    const pkg: Package = {
      dateCreated: new Date(serializedPkg.date_created),
      dateUpdated: new Date(serializedPkg.date_updated),
      name: serializedPkg.name,
      fullName: serializedPkg.full_name,
      isActive: serializedPkg.is_active,
      isPinned: serializedPkg.is_pinned,
      maintainers: serializedPkg.maintainers,
      owner: serializedPkg.owner,
      packageUrl: serializedPkg.package_url,
      totalDownloads: 0,
      uuid4: serializedPkg.uuid4,
      requiredBy: new Set(),
      versions: serializedPkg.versions.map(v => {
        const ver: PackageVersion = {
          dateCreated: new Date(v.date_created),
          description: v.description,
          downloadUrl: v.download_url,
          downloads: v.downloads,
          name: v.name,
          fullName: v.full_name,
          icon: v.icon,
          isActive: v.is_active,
          pkg: undefined,
          uuid4: v.uuid4,
          version: new SemVer(v.version_number),
          websiteUrl: v.website_url,
          dependencies: []
        };
        totalDownloads += ver.downloads;
        return ver;
      }),
      get latestVersion() {
        return this.versions[0];
      }
    };

    pkg.totalDownloads = totalDownloads;
    if (serializedPkg.installed_version !== undefined) {
      pkg.installedVersion = pkg.versions.find(
        v => v.version.version === serializedPkg.installed_version
      );
    }

    return pkg;
  });

  packages.forEach((pkg, pkgIdx) => {
    pkg.versions.forEach((ver, verIdx) => {
      ver.pkg = pkg;
      serializedPackages[pkgIdx].versions[verIdx].dependencies.forEach(
        depString => {
          const { owner, name, versionNumber } = parseDependencyString(
            depString
          );
          const depPkg = packages.find(
            p => p.owner === owner && p.name === name
          );
          const depVer = depPkg.versions.find(v =>
            satisfies(v.version, `~${versionNumber}`)
          );

          ver.dependencies.push(depVer);
        }
      );
    });
  });

  return packages;
};

export const serializePackage = (pkg: Package): SerializedPackage => {
  const serialized: SerializedPackage = {
    date_created: pkg.dateCreated.toISOString(),
    date_updated: pkg.dateUpdated.toISOString(),
    full_name: pkg.fullName,
    is_active: pkg.isActive,
    is_pinned: pkg.isPinned,
    maintainers: pkg.maintainers,
    package_url: pkg.packageUrl,
    name: pkg.name,
    owner: pkg.owner,
    uuid4: pkg.uuid4,
    versions: pkg.versions.map(
      (v): SerializedPackageVersion => ({
        date_created: v.dateCreated.toISOString(),
        dependencies: v.dependencies.map(d => d.fullName),
        description: v.description,
        download_url: v.downloadUrl,
        downloads: v.downloads,
        full_name: v.fullName,
        icon: v.icon,
        is_active: v.isActive,
        name: v.name,
        readme: v.readme,
        uuid4: v.uuid4,
        version_number: v.version.version,
        website_url: v.websiteUrl
      })
    )
  };

  if (pkg.installedVersion !== undefined) {
    serialized.installed_version = pkg.installedVersion.version.version;
  }

  return serialized;
};

export const serializePackageList = (
  packages: PackageList
): SerializedPackageList => {
  return packages.map((pkg): SerializedPackage => serializePackage(pkg));
};
