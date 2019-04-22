import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { BehaviorSubject } from 'rxjs';
import { PackageList, PackageVersion, Package } from '../models/package.model';

@Injectable()
export class PackageService {
  private installedPackagesSource = new BehaviorSubject<PackageList>([]);
  public installedPackages$ = this.installedPackagesSource.asObservable();

  constructor(private electron: ElectronService) {}

  public installPackage(pkg: Package, version: PackageVersion) {
    this.installedPackagesSource.next([
      ...this.installedPackagesSource.value,
      pkg
    ]);
  }

  public uninstallPackage(pkg: Package) {
    this.installedPackagesSource.next(
      this.installedPackagesSource.value.filter(
        installed => installed.uuid4 !== pkg.uuid4
      )
    );
  }

  public updatePackage(pkg: Package, version: PackageVersion) {}
}
