import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ParseStream, Entry as ZipEntry } from 'unzipper';
import {
  InstalledPackageList,
  PackageVersion,
  Package
} from '../models/package.model';
import { DownloadService } from './download.service';
import { ElectronService } from './electron.service';
import { PreferencesService } from './preferences.service';
import { ReadStream } from 'fs';

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
  private installedPackagesSource = new BehaviorSubject<InstalledPackageList>(
    []
  );
  public installedPackages$ = this.installedPackagesSource.asObservable();

  constructor(
    private download: DownloadService,
    private elecron: ElectronService,
    private prefs: PreferencesService
  ) {}

  public async installPackage(pkg: PackageVersion) {
    if (
      pkg.pkg.uuid4 !== BEPIN_UUID4 &&
      !pkg.dependencies.some(dep => dep.pkg.uuid4 === BEPIN_UUID4)
    ) {
      console.warn(
        `Skipping package ${pkg.fullName} as it's not a Bepis package`
      );
      this.elecron.remote.dialog.showMessageBox(
        this.elecron.remote.getCurrentWindow(),
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
    if (this.elecron.isElectron()) {
      const fileStream = this.elecron.fs.createReadStream(zipPath);
      const zipStream = fileStream.pipe(this.elecron.unzipper.Parse());

      if (pkg.pkg.uuid4 === BEPIN_UUID4) await this.installBepin(zipStream);
      else await this.installZip(fileStream, pkg.pkg.fullName);
    }

    this.installedPackagesSource.next([
      ...this.installedPackagesSource.value,
      { ...pkg.pkg, installedVersion: pkg }
    ]);
  }

  // TODO use InstalledPackage here and add installedPath to InstalledPackage
  public async uninstallPackage(pkg: Package) {
    if (pkg.uuid4 === BEPIN_UUID4) {
      await Promise.all([
        this.elecron.fsExtras.deleteDirectory(
          this.elecron.path.dirname(this.getBepInExPluginPath())
        ),
        this.elecron.fsExtras.deleteFile(
          this.elecron.path.join(this.prefs.get('ror2_path'), 'winhttp.dll')
        ),
        this.elecron.fsExtras.deleteFile(
          this.elecron.path.join(
            this.prefs.get('ror2_path'),
            'doorstop_config.ini'
          )
        )
      ]);
    } else {
      const installedPath = this.elecron.path.join(
        this.getBepInExPluginPath(),
        pkg.fullName
      );

      await this.elecron.fsExtras.deleteDirectory(installedPath);
    }

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

  private installZip(fileStream: ReadStream, path: string): Promise<void> {
    const install_dir = this.elecron.path.join(
      this.getBepInExPluginPath(),
      path
    );
    return fileStream
      .pipe(this.elecron.unzipper.Extract({ path: install_dir }))
      .promise();
  }

  private installBepin(zipStream: ParseStream): Promise<void> {
    // this.elecron.ipcRenderer.send('installBepin', zipFile);
    // return new Promise((resolve, reject) => {
    //   this.elecron.ipcRenderer.on('bepinInstalled', (event, err) => {
    //     if (err) reject(err);
    //     else resolve();
    //   });
    // });
    const install_dir = this.prefs.get('ror2_path');
    return zipStream
      .on('entry', (entry: ZipEntry) => {
        const path = this.elecron.path;
        if (path.dirname(entry.path).startsWith('BepInExPack')) {
          const destination = path.join(
            install_dir,
            entry.path.slice('BepInExPack/'.length)
          );
          if (entry.type === 'Directory') {
            this.elecron.fs.mkdirSync(destination);
          } else {
            entry.pipe(
              this.elecron.fs.createWriteStream(
                path.join(install_dir, entry.path.slice('BepInExPack/'.length))
              )
            );
          }
          entry.autodrain();
        } else {
          entry.autodrain();
        }
      })
      .promise();
  }

  private getBepInExPluginPath() {
    return this.elecron.path.join(
      this.prefs.get('ror2_path'),
      'BepInEx',
      'plugins'
    );
  }
}
