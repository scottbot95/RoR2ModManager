import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import * as semver from 'semver';
import { PackageList } from '../models/package.model';

@Injectable()
export class ThunderstoreService {
  private baseUrl = 'https://thunderstore.io/api/v1';

  private allPackagesSource = new BehaviorSubject<PackageList>(null);
  public allPackages$ = this.allPackagesSource
    .asObservable()
    .pipe(distinctUntilChanged()); // prevents update spam

  constructor(private http: HttpClient) {
    this.loadAllPackages();
  }

  public loadAllPackages(): Observable<PackageList> {
    // clear obseravble to indicate loading status
    const oldPackages = this.allPackagesSource.value;
    this.allPackagesSource.next(null);

    const url = `${this.baseUrl}/package`;
    const result = this.http.get<PackageList>(url).pipe(
      tap(packages => {
        packages.forEach(pkg => {
          pkg.latest_version = pkg.versions.reduce(
            (latest, version) =>
              semver.gt(version.version_number, latest)
                ? version.version_number
                : latest,
            '0.0.0'
          );
        });
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
