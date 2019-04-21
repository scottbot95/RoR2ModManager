import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Package } from '../models/package';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class ThunderstoreService {
  private baseUrl = 'https://thunderstore.io/api/v1';

  private allPackagesSource = new BehaviorSubject<Package[]>(null);
  public allPackages$ = this.allPackagesSource
    .asObservable()
    .pipe(distinctUntilChanged()); // prevents update spam

  constructor(private http: HttpClient) {
    this.loadAllPackages();
  }

  public loadAllPackages(): Observable<Package[]> {
    // clear obseravble to indicate loading status
    const oldPackages = this.allPackagesSource.value;
    this.allPackagesSource.next(null);

    const url = `${this.baseUrl}/package`;
    const result = this.http.get<Package[]>(url);
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
