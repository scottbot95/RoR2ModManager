import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { BehaviorSubject } from 'rxjs';
import {
  PackageVersion,
  Package,
  InstalledPackageList,
  PackageList,
  PackageVersionList
} from '../models/package.model';

export interface PackageChangeset {
  updated: Set<PackageVersion>;
  removed: Set<Package>;
}

export class PackageChangeset {
  updated = new Set<PackageVersion>();
  removed = new Set<Package>();
}

@Injectable()
export class PackageService {
  private installedPackagesSource = new BehaviorSubject<InstalledPackageList>(
    []
  );
  public installedPackages$ = this.installedPackagesSource.asObservable();

  constructor(private electron: ElectronService) {}

  public installPackage(pkg: PackageVersion) {
    this.installedPackagesSource.next([
      ...this.installedPackagesSource.value,
      { ...pkg.pkg, installed_version: pkg }
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

  public applyChanges(changeset: PackageChangeset) {
    console.log('Applying package changeset', changeset);
    // Add packages that have an old version installed to remove list
    changeset.updated.forEach(update => {
      const existing = this.installedPackagesSource.value.find(
        pkg => pkg.uuid4 === update.uuid4
      );
      if (existing !== undefined) {
        changeset.removed.add(existing);
      }
    });

    // uninstall old packages
    changeset.removed.forEach(toRemove => this.uninstallPackage(toRemove));

    // install new packages
    changeset.updated.forEach(toInstall => this.installPackage(toInstall));
  }
}
