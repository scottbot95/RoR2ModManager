import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  SerializablePackageList,
  PackageList,
  parseSerializablePackageList
} from '../models/package.model';

@Injectable()
export class ThunderstoreService {
  private baseUrl = 'https://thunderstore.io/api/v1';

  private allPackagesSource = new BehaviorSubject<PackageList>(null);
  public allPackages$ = this.allPackagesSource
    .asObservable()
    .pipe(distinctUntilChanged()); // prevents update spam

  constructor(private http: HttpClient) {}

  public loadAllPackages(): Observable<PackageList> {
    // clear obseravble to indicate loading status
    const oldPackages = this.allPackagesSource.value;
    this.allPackagesSource.next(null);

    // also clear out indexeddb
    // this.db.clearPackages();

    const url = `${this.baseUrl}/package`;
    const result = this.http.get<SerializablePackageList>(url).pipe(
      map(apiPackages => {
        const packages = parseSerializablePackageList(apiPackages);

        // this.db.savePackages(apiPackages);
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
