import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  SerializablePackageList,
  PackageList,
  Package,
  PackageVersion
} from '../models/package.model';
import { SemVer, satisfies } from 'semver';
import { DatabaseService } from './database.service';

@Injectable()
export class ThunderstoreService {
  private baseUrl = 'https://thunderstore.io/api/v1';

  private allPackagesSource = new BehaviorSubject<PackageList>(null);
  public allPackages$ = this.allPackagesSource
    .asObservable()
    .pipe(distinctUntilChanged()); // prevents update spam

  constructor(private http: HttpClient, private db: DatabaseService) {
    this.loadAllPackages();
  }

  public loadAllPackages(): Observable<PackageList> {
    // clear obseravble to indicate loading status
    const oldPackages = this.allPackagesSource.value;
    this.allPackagesSource.next(null);

    // also clear out indexeddb
    this.db.clearPackages();

    const url = `${this.baseUrl}/package`;
    const result = this.http.get<SerializablePackageList>(url).pipe(
      map(apiPackages => {
        const packages = apiPackages.map(apiPkg => {
          let totalDownloads = 0;
          const pkg: Package = {
            dateCreated: new Date(apiPkg.date_created),
            dateUpdated: new Date(apiPkg.date_updated),
            name: apiPkg.name,
            fullName: apiPkg.full_name,
            isActive: apiPkg.is_active,
            isPinned: apiPkg.is_pinned,
            maintainers: apiPkg.maintainers,
            owner: apiPkg.owner,
            totalDownloads: 0,
            uuid4: apiPkg.uuid4,
            requiredBy: new Set(),
            versions: apiPkg.versions.map(v => {
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
            apiPackages[pkgIdx].versions[verIdx].dependencies.forEach(
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
          this.db.savePackage(pkg);
        });

        return packages;
      })
    );
    result.subscribe(
      packages => {
        this.allPackagesSource.next(packages);
      },
      err => {
        console.error(err);
        // restore old package list in case of failure
        this.allPackagesSource.next(oldPackages);
      }
    );
    return result;
  }
}
