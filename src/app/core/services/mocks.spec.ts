import {
  UserPreferences,
  defaultConfig
} from '../../../../electron/preferences.model';
import { ChangeEvent } from './preferences.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PackageList, Package, PackageVersion } from '../models/package.model';
import { SelectionModel } from '@angular/cdk/collections';
import { SelectablePackge } from './package.service';
import { Component } from '@angular/core';

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
}

export class MockElectronService {
  ipcRenderer = { on: () => {}, send: () => {} };
  remote = {
    dialog: {
      showOpenDialog: (options: object) => {
        return ['C:\\fakepath'];
      },
      showMessageBox: () => {}
    },
    require: (module: string) => ({}),
    getCurrentWindow: () => {}
  };
  fs = {
    createWriteStream: () => {},
    createReadStream: () => {}
  };
  protocol = {
    registerHttpProtocol: () => {}
  };
  isElectron() {
    return false;
  }
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
  registerMenuHandlers() {}
}

export class MockChangeDetectorRef {
  detectChanges() {}
}

@Component({
  selector: 'app-nav-menu',
  template: '<ng-content></ng-content>'
})
export class MockNavMenuComponent {}
