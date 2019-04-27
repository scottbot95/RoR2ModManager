import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  PackageList,
  PackageVersion,
  Package,
  deserializablePackageList
} from '../models/package.model';
import { DownloadService } from './download.service';
import { ElectronService } from './electron.service';
import { PreferencesService } from './preferences.service';
import { ReadStream } from 'fs';
import { ThunderstoreService } from './thunderstore.service';
import { DatabaseService } from './database.service';

export interface PackageChangeset {
  updated: Set<PackageVersion>;
  removed: Set<Package>;
}

export class PackageChangeset {
  updated = new Set<PackageVersion>();
  removed = new Set<Package>();
}

const BEPIN_UUID4 = '4c253b36-fd0b-4e6d-b4d8-b227972af4da';

@Injectable()
export class PackageService {
  private installedPackagesSource = new BehaviorSubject<PackageList>([]);
  public installedPackages$ = this.installedPackagesSource.asObservable();

  private allPackagesSource = new BehaviorSubject<PackageList>([]);
  public allPackages$ = this.allPackagesSource.asObservable();

  constructor(
    private download: DownloadService,
    private electron: ElectronService,
    private prefs: PreferencesService,
    private thunderstore: ThunderstoreService,
    private db: DatabaseService
  ) {
    if (this.prefs.get('checkUpdatesOnStart')) {
      this.downloadPackageList();
    } else {
      this.loadPackagesFromCache()
        .then(packages => {
          // if we didn't load any packages, download them
          console.log('Package cache is empty, downloading list');
          if (!Array.isArray(packages) || packages.length === 0) {
            this.downloadPackageList();
          }
        })
        .catch(err => {
          console.error(err);
          this.downloadPackageList();
        });
    }
  }

  public async loadPackagesFromCache(): Promise<PackageList> {
    const serializedPackages = await this.db.packageTable.toArray();

    const packages = deserializablePackageList(serializedPackages);

    this.installedPackagesSource.next(
      packages.filter(pkg => pkg.installedVersion)
    );
    this.allPackagesSource.next(packages);

    console.log('Loaded packages from cache', packages);
    return packages;
  }

  public downloadPackageList(): Observable<PackageList> {
    const oldPackages = this.allPackagesSource.value;
    this.allPackagesSource.next(null);

    this.thunderstore.loadAllPackages().subscribe(
      packages => {
        if (packages) {
          this.db.bulkUpdatePackages(packages);
          this.allPackagesSource.next(packages);
        }
      },
      err => {
        console.error('Failed to download packages');
        console.error(err);
        this.allPackagesSource.next(oldPackages);
      }
    );
    return this.allPackages$;
  }

  public async installPackage(pkg: PackageVersion) {
    if (
      pkg.pkg.uuid4 !== BEPIN_UUID4 &&
      !pkg.dependencies.some(dep => dep.pkg.uuid4 === BEPIN_UUID4)
    ) {
      console.warn(
        `Skipping package ${pkg.fullName} as it's not a Bepis package`
      );
      this.electron.remote.dialog.showMessageBox(
        this.electron.remote.getCurrentWindow(),
        {
          type: 'warning',
          title: 'Skipping package',
          message: `${
            pkg.fullName
          } is not a Bepis package. This is currently unsupported, as such it will be skipped`,
          buttons: ['Ok']
        }
      );
      return;
    }

    const zipPath = await this.download.download(pkg);
    // Dirty hack because the specs really didn't like this
    if (this.electron.isElectron()) {
      const fileStream = this.electron.fs.createReadStream(zipPath);

      if (pkg.pkg.uuid4 === BEPIN_UUID4) await this.installBepin(fileStream);
      else await this.installBepInPlugin(fileStream, pkg.pkg.fullName);
    }

    pkg.pkg.installedVersion = pkg;

    await this.db.updatePackage(pkg.pkg.uuid4, {
      installed_version: pkg.version.version
    });

    this.installedPackagesSource.next([
      ...this.installedPackagesSource.value,
      { ...pkg.pkg, installedVersion: pkg }
    ]);
  }

  // TODO use InstalledPackage here and add installedPath to InstalledPackage
  public async uninstallPackage(pkg: Package) {
    if (pkg.uuid4 === BEPIN_UUID4) {
      await Promise.all([
        this.electron.fs.remove(
          this.electron.path.dirname(this.getBepInExPluginPath())
        ),
        this.electron.fs.remove(
          this.electron.path.join(this.prefs.get('ror2_path'), 'winhttp.dll')
        ),
        this.electron.fs.remove(
          this.electron.path.join(
            this.prefs.get('ror2_path'),
            'doorstop_config.ini'
          )
        )
      ]);
    } else {
      const installedPath = this.electron.path.join(
        this.getBepInExPluginPath(),
        pkg.fullName
      );

      await this.electron.fs.remove(installedPath);
    }

    pkg.installedVersion = null;

    await this.db.updatePackage(pkg.uuid4, { installed_version: null });

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

  private extractZip(fileStream: ReadStream, path: string): Promise<void> {
    return fileStream.pipe(this.electron.unzipper.Extract({ path })).promise();
  }

  private installBepInPlugin(fileStream: ReadStream, plugin_dir: string) {
    const install_dir = this.electron.path.join(
      this.getBepInExPluginPath(),
      plugin_dir
    );

    return this.extractZip(fileStream, install_dir);
  }

  private async installBepin(fileStream: ReadStream): Promise<void> {
    const path = this.electron.path;
    const fs = this.electron.fs;
    const glob = this.electron.glob;
    const install_dir = this.prefs.get('ror2_path');

    const tmp_path = path.join(
      this.electron.remote.app.getPath('temp'),
      this.electron.remote.app.getName(),
      'BepInExPack'
    );
    // extract zip
    await this.extractZip(fileStream, tmp_path);
    return new Promise((resolve, reject) => {
      glob(
        'BepInExPack/**/*',
        {
          realpath: true,
          nodir: true,
          cwd: tmp_path
        },
        (err, files) => {
          if (err) return reject(err);
          Promise.all(
            files.map(async file => {
              const relativePath = file.slice(
                (tmp_path + '/BepInExPack/').length
              );
              return fs.move(file, path.join(install_dir, relativePath));
            })
          )
            .then(() => {
              resolve();
            })
            .catch(reject);
        }
      );
    });
  }

  private getBepInExPluginPath() {
    return this.electron.path.join(
      this.prefs.get('ror2_path'),
      'BepInEx',
      'plugins'
    );
  }
}
