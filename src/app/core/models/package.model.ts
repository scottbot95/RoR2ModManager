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

export interface SerializablePackage extends SerializablePackageBase {
  owner: string;
  maintainers: string[];
  date_updated: string;
  is_pinned: boolean;
  versions: SerializablePackageVersionList;
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
  versions: PackageVersionList;
  latestVersion: PackageVersion;
  totalDownloads: number;
  requiredBy: Set<PackageVersion>;

  selected?: boolean;
}

export class PackageVersion extends PackageBase {
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

export class InstalledPackage extends Package {
  // undefined if no version is installed
  installedVersion: PackageVersion | undefined;
}

export type SerializablePackageList = SerializablePackage[];
export type SerializablePackageVersionList = SerializablePackageVersion[];
export type PackageList = Package[];
export type PackageVersionList = PackageVersion[];
export type InstalledPackageList = InstalledPackage[];

export const parseSerializablePackageList = (
  serializedPackages: SerializablePackageList
) => {
  const packages = serializedPackages.map(serializedPkg => {
    let totalDownloads = 0;
    console.log(serializedPkg.versions);
    const pkg: Package = {
      dateCreated: new Date(serializedPkg.date_created),
      dateUpdated: new Date(serializedPkg.date_updated),
      name: serializedPkg.name,
      fullName: serializedPkg.full_name,
      isActive: serializedPkg.is_active,
      isPinned: serializedPkg.is_pinned,
      maintainers: serializedPkg.maintainers,
      owner: serializedPkg.owner,
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
          versionNumber: new SemVer(v.version_number),
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

    return pkg;
  });

  packages.forEach((pkg, pkgIdx) => {
    pkg.versions.forEach((ver, verIdx) => {
      ver.pkg = pkg;
      serializedPackages[pkgIdx].versions[verIdx].dependencies.forEach(
        depString => {
          const [owner, name, versionString] = depString.split('-');
          const depPkg = packages.find(
            p => p.owner === owner && p.name === name
          );
          const depVer = depPkg.versions.find(v =>
            satisfies(v.versionNumber, `~${versionString}`)
          );

          ver.dependencies.push(depVer);
        }
      );
    });
  });

  return packages;
};
