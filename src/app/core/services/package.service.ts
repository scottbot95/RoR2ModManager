import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  InstalledPackageList,
  PackageVersion,
  Package
} from '../models/package.model';
import { DownloadService } from './download.service';

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

  constructor(private download: DownloadService) {}

  public async installPackage(pkg: PackageVersion) {
    this.installedPackagesSource.next([
      ...this.installedPackagesSource.value,
      { ...pkg.pkg, installedVersion: pkg }
    ]);
    await this.download.download(pkg);
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
