import { Injectable, EventEmitter } from '@angular/core';
import { ElectronService } from '../../core/services/electron.service';
import { PackageService } from '../../core/services/package.service';
import { Package, PackageVersionList } from '../../core/models/package.model';
import { PROFILE_EXTENSIONS } from '../constants';
import { PackageProfile } from '../../core/models/profile.model';

@Injectable()
export class ProfileService {
  private allPackages: Package[] = [];

  public confirmProfile = new EventEmitter<void>(true);

  constructor(
    private electron: ElectronService,
    private packages: PackageService
  ) {
    this.exportToFile = this.exportToFile.bind(this);
    this.importFromFile = this.importFromFile.bind(this);
    this.packages.allPackages$.subscribe(pkgs => {
      if (Array.isArray(pkgs) && pkgs.length > 0) {
        this.allPackages = pkgs;
      }
    });

    this.electron.ipcRenderer.send('clearProfiles');
    this.electron.ipcRenderer.send('addProfile', 'default', 'test1');
    this.electron.ipcRenderer.send('addProfile', 'test2');
  }

  public registerMenuHandlers() {
    this.electron.ipcRenderer.on(
      'importProfile',
      this.showImportDialog.bind(this)
    );

    this.electron.ipcRenderer.on(
      'exportProfile',
      this.showExportDialog.bind(this)
    );

    this.electron.ipcRenderer.on(
      'switchProfile',
      this.switchProfile.bind(this)
    );
  }

  public showImportDialog() {
    this.electron.remote.dialog.showOpenDialog(
      this.electron.remote.getCurrentWindow(),
      { filters: PROFILE_EXTENSIONS },
      this.importFromFile
    );
  }

  public showExportDialog() {
    this.electron.remote.dialog.showSaveDialog(
      this.electron.remote.getCurrentWindow(),
      {
        filters: PROFILE_EXTENSIONS
      },
      this.exportToFile
    );
  }

  private switchProfile(event: Electron.Event, profile: string) {
    this.electron.ipcRenderer.send('switchProfile', profile);
    console.log('Switching to profile ', profile);
  }

  private async importFromFile(filenames: string[]) {
    if (!Array.isArray(filenames) || filenames.length === 0) return;
    const [file] = filenames;

    let errors = [];
    let packages: PackageVersionList;
    try {
      const profile: PackageProfile = await this.electron.fs.readJson(file);
      packages = profile
        .map(dep => {
          try {
            return this.packages.findPackageFromDependencyString(dep);
          } catch (err) {
            if (
              err.name === 'PackageSourceEmptyError' ||
              err.name === 'PackageNotFoundError'
            ) {
              errors.push(err);
            }
          }
        })
        .filter(p => p); // remove false elements
    } catch (err) {
      if (err.name === 'SyntaxError') {
        errors = ['Cannot failed to parse profile file'];
      } else {
        errors = [err.message || err];
      }
    }

    if (errors.length) {
      this.electron.remote.dialog.showMessageBox(
        this.electron.remote.getCurrentWindow(),
        {
          title: 'Error',
          type: 'error',
          buttons: ['Ok'],
          message: errors.join('\n')
        }
      );
      return;
    }

    this.packages.selection.clear();
    packages.forEach(pkg => {
      console.log(`Selecting package from profile ${pkg.name}`);
      this.packages.selection.select(pkg.pkg);
    });

    this.confirmProfile.emit();
  }

  private async exportToFile(filename: string) {
    if (filename === undefined) return;
    const installed = this.allPackages
      .filter(p => p.installedVersion)
      .map(p => p.installedVersion.fullName);
    console.log('Writing profile file', installed);
    try {
      await this.electron.fs.remove(filename);
    } catch {}
    await this.electron.fs.writeJson(filename, installed);
  }
}
