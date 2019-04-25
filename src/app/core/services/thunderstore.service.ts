import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  SerializablePackageList,
  PackageList,
  Package,
  PackageVersion,
  parseSerializablePackageList
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
    this.loadPackagesFromCache()
      .then(packages => {
        console.log('Loaded from cache');
        if (!Array.isArray(packages) || packages.length === 0) {
          this.loadAllPackages();
        }
      })
      .catch(err => {
        console.error(err);
        this.loadAllPackages();
      });
  }

  public async loadPackagesFromCache(): Promise<PackageList> {
    const serializedPackages = await this.db.packageTable.toArray();
    // map dependency references this should be dried up probably...
    const packages = parseSerializablePackageList(serializedPackages);

    this.allPackagesSource.next(packages);
    console.log('Loaded packages from cache', packages);
    return packages;
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
        const packages = parseSerializablePackageList(apiPackages);

        this.db.savePackages(apiPackages);
        console.log('Downloaded package list', packages);
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
    return this.allPackages$;
  }
}
