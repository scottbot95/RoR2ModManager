import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {
  PackageVersion,
  Package,
  deserializablePackageList,
  parseDependencyString
} from '../models/package.model';
import { DownloadService } from './download.service';
import { ElectronService } from './electron.service';
import { PreferencesService } from './preferences.service';
import { ReadStream } from 'fs';
import { ThunderstoreService } from './thunderstore.service';
import { DatabaseService } from './database.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Selectable } from '../models/selectable.model';

export interface SelectablePackge extends Selectable, Package {}

import { protocols } from '../../../../package.json';

export interface PackageChangeset {
  updated: Set<PackageVersion>;
  removed: Set<Package>;
}

export class PackageChangeset {
  updated = new Set<PackageVersion>();
  removed = new Set<Package>();
}

export const BEPIN_UUID4 = '4c253b36-fd0b-4e6d-b4d8-b227972af4da';

@Injectable()
export class PackageService {
  private installedPackagesSource = new BehaviorSubject<SelectablePackge[]>([]);
  public installedPackages$ = this.installedPackagesSource.asObservable();

  private allPackagesSource = new BehaviorSubject<SelectablePackge[]>([]);
  public allPackages$ = this.allPackagesSource.asObservable();

  public selectedPackage = new BehaviorSubject<Package>(undefined);
  public selection = new SelectionModel<SelectablePackge>(true, []);

  public pendingChanges = new BehaviorSubject<PackageChangeset>(
    new PackageChangeset()
  );

  public log$ = new ReplaySubject<ReplaySubject<string>>(1);
  private log: ReplaySubject<string>;

  private applyPercentageSource = new BehaviorSubject<number>(null);
  public applyPercentage$ = this.applyPercentageSource.asObservable();

  public doneApplyingChanges = new EventEmitter<void>();

  private totalSteps = 0;
  private stepsComplete = 0;

  constructor(
    private download: DownloadService,
    private electron: ElectronService,
    private prefs: PreferencesService,
    private thunderstore: ThunderstoreService,
    private db: DatabaseService
  ) {
    this.registerHttpProtocol();

    this.log$.next(new ReplaySubject<string>());
    this.log$.subscribe(log => {
      this.log = log;
    });

    if (this.prefs.get('updatePackagesOnStart')) {
      this.downloadPackageList();
    } else {
      this.loadPackagesFromCache()
        .then(packages => {
          // if we didn't load any packages, download them
          if (!Array.isArray(packages) || packages.length === 0) {
            console.log('Package cache is empty, downloading list');
            this.downloadPackageList();
          }
        })
        .catch(err => {
          console.error(err);
          this.downloadPackageList();
        });
    }
  }

  public clearLog() {
    this.log$.next(new ReplaySubject<string>());
  }

  public async loadPackagesFromCache(): Promise<SelectablePackge[]> {
    const serializedPackages = await this.db.packageTable.toArray();

    const packages = deserializablePackageList(serializedPackages);

    this.installedPackagesSource.next(
      packages.filter(pkg => pkg.installedVersion)
    );
    this.allPackagesSource.next(packages);

    console.log('Loaded packages from cache', packages);
    return packages;
  }

  public downloadPackageList(): Observable<SelectablePackge[]> {
    const oldPackages = this.allPackagesSource.value;
    this.allPackagesSource.next(null);

    this.thunderstore.loadAllPackages().subscribe(
      async packages => {
        if (packages) {
          await this.db.bulkUpdatePackages(packages);
          // be a little smarter about this maybe?
          const newPackages = await this.loadPackagesFromCache();
          this.allPackagesSource.next(newPackages);
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
      const message = `Skipping package ${
        pkg.fullName
      } as it's not a Bepis package`;
      console.warn(message);
      this.log.next(message);
      // this.electron.remote.dialog.showMessageBox(
      //   this.electron.remote.getCurrentWindow(),
      //   {
      //     type: 'warning',
      //     title: 'Skipping package',
      //     message: `${
      //       pkg.fullName
      //     } is not a Bepis package. This is currently unsupported, as such it will be skipped`,
      //     buttons: ['Ok']
      //   }
      // );
      return;
    }
    this.log.next(`Downloading ${pkg.name}...`);
    const zipPath = await this.download.download(pkg);
    this.completeStep();
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

    this.completeStep();
    this.log.next(`Finished installing ${pkg.name}`);
  }

  // TODO use InstalledPackage here and add installedPath to InstalledPackage
  public async uninstallPackage(pkg: Package) {
    this.log.next(`Removing ${pkg.name}...`);
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

    this.completeStep();
    this.log.next(`Finished removing ${pkg.name}`);

    return pkg.uuid4;
    // this.installedPackagesSource.next(
    //   this.installedPackagesSource.value.filter(
    //     installed => installed.uuid4 !== pkg.uuid4
    //   )
    // );
  }

  public resetSelection() {
    this.selection.clear();
    for (const pkg of this.installedPackagesSource.value) {
      if (pkg.installedVersion) this.selection.select(pkg);
    }
  }

  public async applyChanges(
    changeset: PackageChangeset = this.pendingChanges.value
  ) {
    console.log('Applying package changeset', changeset);
    this.log.next('Applying changes...');
    // Add packages that have an old version installed to remove list
    changeset.updated.forEach(update => {
      const existing = this.installedPackagesSource.value.find(
        pkg => pkg.uuid4 === update.uuid4
      );
      if (existing !== undefined) {
        changeset.removed.add(existing);
      }
    });

    this.totalSteps = changeset.updated.size * 2 + changeset.removed.size;
    this.stepsComplete = 0;
    this.applyPercentageSource.next(0);

    this.log.next('Uninstalling packages marked for removal...');
    // uninstall old packages
    const uuids = await Promise.all(
      Array.from(changeset.removed).map(toRemove =>
        this.uninstallPackage(toRemove)
      )
    );
    console.log('Removed packages', uuids);
    this.log.next('Finished uninstalling packages!');

    this.installedPackagesSource.next(
      this.installedPackagesSource.value.filter(
        installed => !uuids.includes(installed.uuid4)
      )
    );

    this.log.next('Installing packages...');
    // install new packages
    await Promise.all(
      Array.from(changeset.updated).map(toInstall =>
        this.installPackage(toInstall)
      )
    );

    this.log.next('Finished installing packages!');

    this.doneApplyingChanges.emit();
  }

  public findPackageFromDependencyString(
    depString: string
  ): PackageVersion | undefined {
    if (
      !Array.isArray(this.allPackagesSource.value) ||
      this.allPackagesSource.value.length === 0
    ) {
      const err = new Error('No packages loaded yet. Try again later');
      err.name = 'PackageSourceEmptyError';
      throw err;
    }
    const { name, owner, versionNumber } = parseDependencyString(depString);
    const foundPkg = this.allPackagesSource.value.find(
      pkg => pkg.owner === owner && pkg.name === name
    );
    if (!foundPkg) {
      const err = new Error(`Could not find package for ${depString}`);
      err.name = 'PackageNotFoundError';
      throw err;
    }
    const foundVersion = foundPkg.versions.find(
      ver => ver.version.version === versionNumber
    );

    if (!foundVersion) {
      const err = new Error(`Could not find package version for ${depString}`);
      err.name = 'PackageNotFoundError';
      throw err;
    }
    return foundVersion;
  }

  private extractZip(fileStream: ReadStream, path: string): Promise<void> {
    return fileStream.pipe(this.electron.unzipper.Extract({ path })).promise();
  }

  private installBepInPlugin(fileStream: ReadStream, plugin_dir: string) {
    const install_dir = this.electron.path.join(
      this.getBepInExPluginPath(),
      plugin_dir
    );
    this.log.next(`Extracting to BepInEx/plugins/${plugin_dir}`);
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
    this.log.next(`Extracting BepInEx...`);
    await this.extractZip(fileStream, tmp_path);
    this.log.next(`Installing BepInEx...`);
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

  private registerHttpProtocol() {
    for (const scheme of protocols) {
      console.log(`Registering protocol ${scheme}`);
      this.electron.protocol.registerHttpProtocol(scheme, (req, cb) => {
        // format ror2mm://v1/install/thunderstore.io/[author]/[package]/[version]/
        const chunks = req.url.split('/');
        // const protocol = chunks[0];
        const [
          protocolVersion,
          action,
          provider,
          author,
          packageName,
          version
        ] = chunks.slice(2);
        if (
          protocolVersion === 'v1' &&
          action === 'install' &&
          provider === 'thunderstore.io'
        ) {
          const packageToInstall = this.allPackagesSource.value.find(
            p => p.owner === author && p.name === packageName
          );
          const versionToInstall = packageToInstall.versions.find(
            v => v.version.version === version
          );
          console.log('Marking package for install', versionToInstall);
          this.selection.select(versionToInstall.pkg);
          this.selectedPackage.next(packageToInstall);
        }
      });
    }
  }

  private completeStep() {
    this.stepsComplete += 1;
    if (this.stepsComplete > this.totalSteps)
      console.warn(
        `More steps completed, than available. Completed ${
          this.stepsComplete
        }. Total ${this.totalSteps}`
      );
    if (this.totalSteps > 0)
      this.applyPercentageSource.next(this.stepsComplete / this.totalSteps);
    else
      console.warn('Attempting to complete step, but there are 0 total steps');
  }
}
