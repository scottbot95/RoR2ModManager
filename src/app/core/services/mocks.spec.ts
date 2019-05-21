import {
  UserPreferences,
  defaultConfig
} from '../../../../electron/preferences.model';
import { ChangeEvent } from './preferences.service';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PackageList, Package, PackageVersion } from '../models/package.model';
import { SelectionModel } from '@angular/cdk/collections';
import { SelectablePackge, PackageChangeset } from './package.service';
import { Component, EventEmitter } from '@angular/core';
import * as path from 'path';
import { PackageProfile } from '../models/profile.model';

export class MockPreferencesService {
  private data: UserPreferences = defaultConfig;

  set<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    this.data[key] = value;
  }

  get<K extends keyof UserPreferences>(key: K) {
    return this.data;
  }

  onChange<K extends keyof UserPreferences>(
    key: K
  ): Observable<ChangeEvent<UserPreferences[K]>> {
    return of({ oldValue: undefined, newValue: undefined });
  }
}

export class MockHttpClient {
  get() {
    return of();
  }
  post() {}
  delete() {}
  put() {}
}

export class MockThemeService {
  private isDarkModeSource = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSource.asObservable();
  themeClass$ = this.isDarkModeSource
    .asObservable()
    .pipe(map(darkMode => (darkMode ? 'app-dark-theme' : 'app-light-theme')));
  toggleDarkMode() {
    this.isDarkModeSource.next(!this.isDarkModeSource.value);
  }
}

export class MockPackageService {
  installedPackages$ = new BehaviorSubject<PackageList>([]);

  allPackages$ = new BehaviorSubject<PackageList>([]);

  selection = new SelectionModel<SelectablePackge>();
  selectedPackage = new BehaviorSubject<Package>(undefined);

  pendingChanges = new BehaviorSubject<PackageChangeset>(
    new PackageChangeset()
  );

  log$ = new Subject<Subject<string>>();
  applyPercentage$ = new Subject<number>();

  doneApplyingChanges = new EventEmitter<void>();

  installPackage(pkg: Package, version: PackageVersion) {
    this.installedPackages$.next([...this.installedPackages$.value, pkg]);
  }

  public uninstallPackage(pkg: Package) {
    this.installedPackages$.next(
      this.installedPackages$.value.filter(
        installed => installed.uuid4 !== pkg.uuid4
      )
    );
  }

  public updatePackage(pkg: Package, version: PackageVersion) {}

  public findPackageFromDependencyString() {}
  public installProfile() {}
}

export class MockElectronService {
  ipcRenderer = {
    on: () => {},
    send: () => {},
    sendTo: () => {},
    removeListener: () => {}
  };
  remote = {
    dialog: {
      showOpenDialog: (options: object) => {
        return ['C:\\fakepath'];
      },
      showMessageBox: () => {},
      showSaveDialog: () => {}
    },
    require: (module: string) => ({}),
    getCurrentWindow: () => {}
  };
  fs = {
    createWriteStream: () => {},
    createReadStream: () => {},
    readJson: () => {},
    writeJson: () => {},
    access: () => {}
  };
  protocol = {
    registerHttpProtocol: () => {}
  };
  path = path;
  isElectron() {
    return false;
  }
  glob() {}
  showMessageBox() {}
}

export class MockDownloadService {
  async download(): Promise<object> {
    const mockResult = {};
    return mockResult;
  }
}

export class MockThunderstoreService {
  public allPackages$ = new BehaviorSubject<PackageList>([]);

  loadAllPackages(): Observable<PackageList> {
    return this.allPackages$;
  }
}

export class MockProfileService {
  confirmProfile = new Subject<void>();

  registerMenuHandlers() {}
}

@Component({
  selector: 'app-nav-menu',
  template: '<ng-content></ng-content>'
})
export class MockNavMenuComponent {}

export class MockWebContents {
  constructor() {
    this.id = ++MockWebContents._nextId;
  }
  private static _nextId = 0;
  id: number;
}

export class MockBrowserWindow {
  webContents = new MockWebContents();
  private parent;
  getParentWindow() {
    if (!this.parent) this.parent = new MockBrowserWindow();
    return this.parent;
  }
  focus() {}
  close() {}
}

export class MockConfigParserService {
  parseFile() {}
}

export class MockDatabaseService {
  public saveProfile(profile: PackageProfile) {}

  public updateProfile(profile: PackageProfile) {}

  public getProfiles() {}

  public deleteProfile(profile: string) {}
}

export class MockDialogService {
  public dialogInput = new Subject<any>();
  public async openDialog() {}
  public dialogReady() {}
  public closeDialog() {}
}
