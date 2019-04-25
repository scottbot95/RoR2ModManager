import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ApiPackageVersion,
  ApiPackage,
  InstalledPackageList
} from '../models/package.model';
import { DownloadService } from './download.service';

export interface PackageChangeset {
  updated: Set<ApiPackageVersion>;
  removed: Set<ApiPackage>;
}

export class PackageChangeset {
  updated = new Set<ApiPackageVersion>();
  removed = new Set<ApiPackage>();
}

@Injectable()
export class PackageService {
  private installedPackagesSource = new BehaviorSubject<InstalledPackageList>(
    []
  );
  public installedPackages$ = this.installedPackagesSource.asObservable();

  constructor(private download: DownloadService) {}

  public installPackage(pkg: ApiPackageVersion) {
    this.installedPackagesSource.next([
      ...this.installedPackagesSource.value,
      { ...pkg.pkg, installed_version: pkg }
    ]);
    this.download.download(pkg);
  }

  public uninstallPackage(pkg: ApiPackage) {
    this.installedPackagesSource.next(
      this.installedPackagesSource.value.filter(
        installed => installed.uuid4 !== pkg.uuid4
      )
    );
  }

  public updatePackage(pkg: ApiPackage, version: ApiPackageVersion) {}

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
