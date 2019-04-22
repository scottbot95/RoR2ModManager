import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { BehaviorSubject } from 'rxjs';
import { PackageList, PackageVersion } from '../models/package.model';

@Injectable()
export class PackageService {
  private installedPackagesSource = new BehaviorSubject<PackageList>([]);
  public installedPackages$ = this.installedPackagesSource.asObservable();

  constructor(private electron: ElectronService) {}

  public installPackage(pkg: PackageVersion) {}
}
