import { Injectable, EventEmitter } from '@angular/core';
import { ElectronService } from '../../core/services/electron.service';
import { PackageService } from '../../core/services/package.service';
import { Package, PackageVersionList } from '../../core/models/package.model';
import { PROFILE_EXTENSIONS, DEFAULT_PROFILE_EXTENSION } from '../constants';
import { PackageProfile } from '../../core/models/profile.model';
import { DatabaseService } from '../../core/services/database.service';
import { DialogWindowOptions } from '../../../../electron/ipc';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface CreateProfileOptions {
  name: string;
  copyFrom?: string;
}

@Injectable()
export class ProfileService {
  private allPackages: Package[] = [];

  public confirmProfile = new EventEmitter<void>(true);

  private profileNamesSource = new BehaviorSubject<string[]>([]);
  public profileNames$ = this.profileNamesSource.asObservable();

  public profiles = new Map<string, PackageProfile>();
  public activeProfileName: string;

  constructor(
    private electron: ElectronService,
    private packages: PackageService,
    private db: DatabaseService
  ) {
    this.exportToFile = this.exportToFile.bind(this);
    this.importFromFile = this.importFromFile.bind(this);

    this.packages.allPackages$.subscribe(pkgs => {
      if (Array.isArray(pkgs) && pkgs.length > 0) {
        this.allPackages = pkgs;
      }
    });

    this.packages.installedPackages$.subscribe(installed => {
      if (this.activeProfileName) {
        this.db.updateProfile({
          name: this.activeProfileName,
          packages: installed.map(pkg => pkg.installedVersion.fullName),
          version: 1
        });
      }
    });

    this.refreshPackages();
  }

  public async refreshPackages() {
    const profilesP = this.db.getProfiles();
    this.electron.ipcRenderer.sendSync('clearProfiles');
    const profiles = await profilesP;
    profiles.forEach(profile => {
      this.profiles.set(profile.name, profile);
      this.electron.ipcRenderer.sendSync('addProfile', profile.name);
    });

    this.profileNamesSource.next(profiles.map(p => p.name));

    this.activeProfileName = localStorage.getItem('activeProfile');
    if (!this.activeProfileName) {
      this.activeProfileName = 'default';
      localStorage.setItem('activeProfile', 'default');
      await this.db.saveProfile({ name: 'default', version: 1, packages: [] });
    }
    this.electron.ipcRenderer.sendSync('switchProfile', this.activeProfileName);
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
      this.handleSwitchProfile.bind(this)
    );

    this.electron.ipcRenderer.on('newProfile', this.newProfile.bind(this));

    this.electron.ipcRenderer.on(
      'createProfile',
      (event: Electron.Event, opts: CreateProfileOptions) =>
        this.createProfile(opts)
    );

    this.electron.ipcRenderer.on('deleteProfile', () => {
      this.deleteProfile(this.activeProfileName);
    });
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

  public createProfile(opts: CreateProfileOptions) {
    const profile: PackageProfile = {
      name: opts.name,
      version: 1,
      packages: []
    };
    if (opts.copyFrom) {
      const original = this.profiles.get(opts.copyFrom);
      if (original) {
        profile.packages = [...original.packages];
      }
    }

    this.db.saveProfile(profile);

    this.profiles.set(profile.name, profile);
    this.profileNamesSource.next([
      ...this.profileNamesSource.value,
      profile.name
    ]);
    this.electron.ipcRenderer.sendSync('addProfile', profile.name);
  }

  public deleteProfile(name: string) {
    console.log(`Deleting profile ${name}`, this.profiles.has(name));
    return;
    if (this.profiles.delete(name)) {
      this.profileNamesSource.next(Array.from(this.profiles.keys()));
      this.electron.ipcRenderer.send('removeProfile', name);
      if (this.activeProfileName === name) {
        const profile = this.profiles.get(this.profileNamesSource.value[0]);
        this.switchProfile(profile);
      }
    }
  }

  private handleSwitchProfile(event: Electron.Event, profileName: string) {
    const profile = this.profiles.get(profileName);
    console.log(`Switching to profile ${profileName}`, profile);
    this.switchProfile(profile);
  }

  private newProfile(event: Electron.Event) {
    this.electron.ipcRenderer.send('openDialog', <DialogWindowOptions>{
      slug: 'new-profile',
      width: 300,
      height: 300
    });
  }

  private switchProfile(profile: PackageProfile) {
    let errors = [];
    let packages: PackageVersionList;
    try {
      packages = profile.packages
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
      errors = [err.message || err];
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
      this.packages.selection.select(pkg.pkg);
    });

    this.confirmProfile.emit();
  }

  private async importFromFile(filenames: string[]) {
    if (!Array.isArray(filenames) || filenames.length === 0) return;
    const [file] = filenames;

    try {
      const parsed: PackageProfile | string[] = await this.electron.fs.readJson(
        file
      );
      let profile: PackageProfile;
      if (Array.isArray(parsed))
        profile = { name: 'unknown', version: 1, packages: parsed };
      else if (parsed.version === 1) profile = parsed;
      else throw new Error('Unkown profile version');
      if (this.profiles.has(profile.name)) {
        const clicked = this.electron.remote.dialog.showMessageBox(
          this.electron.remote.getCurrentWindow(),
          {
            title: 'Confirm Overwrite',
            message:
              `A profile with name '${profile.name}' already exists.\n` +
              `Do you want to overwrite existing profile?`,
            buttons: ['Yes', 'No'],
            defaultId: 1,
            type: 'question'
          }
        );
        if (clicked === 0) {
        }
      }
      this.switchProfile(profile);
    } catch (err) {
      let message: string;
      if (err.name === 'SyntaxError') {
        message = 'Cannot failed to parse profile file';
      } else {
        message = err.message || err;
      }

      this.electron.remote.dialog.showMessageBox(
        this.electron.remote.getCurrentWindow(),
        {
          title: 'Error',
          type: 'error',
          buttons: ['Ok'],
          message
        },
        () => {}
      );
    }
  }

  private async exportToFile(filename: string) {
    if (filename === undefined) return;
    const installed = this.allPackages
      .filter(p => p.installedVersion)
      .map(p => p.installedVersion.fullName);
    console.log('Writing profile file', installed);

    const profile: PackageProfile = {
      name: this.electron.path.basename(filename, DEFAULT_PROFILE_EXTENSION),
      version: 1,
      packages: installed
    };
    try {
      await this.electron.fs.remove(filename);
    } catch {}
    await this.electron.fs.writeJson(filename, profile);
  }
}
