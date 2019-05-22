import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import { ElectronService } from '../../core/services/electron.service';
import { testBepInExPackPackage } from '../../core/models/package.model.spec';
import { DatabaseService } from '../../core/services/database.service';
import { DialogService } from '../../dialogs/services/dialog.service';
import {
  MockElectronService,
  MockPackageService,
  MockDatabaseService,
  MockDialogService
} from '../../core/services/mocks.spec';
import { PackageService } from '../../main/services/package.service';

describe('ProfileService', () => {
  let electron: MockElectronService;
  let packages: MockPackageService;
  let service: ProfileService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        { provide: ElectronService, useClass: MockElectronService },
        { provide: PackageService, useClass: MockPackageService },
        { provide: DatabaseService, useClass: MockDatabaseService },
        { provide: DialogService, useClass: MockDialogService }
      ]
    })
  );

  beforeEach(() => {
    electron = TestBed.get(ElectronService);
    packages = TestBed.get(PackageService);
    service = TestBed.get(ProfileService);

    packages.allPackages$.next([testBepInExPackPackage]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update its package list', () => {
    expect((service as any).allPackages).toEqual([testBepInExPackPackage]);
  });

  it('should properly register ipc listeners', () => {
    const spy = spyOn(electron.ipcRenderer, 'on');

    service.registerMenuHandlers();

    expect(spy).toHaveBeenCalledWith('importProfile', jasmine.any(Function));
    expect(spy).toHaveBeenCalledWith('exportProfile', jasmine.any(Function));
  });

  it('calls `dialog.showSaveDialog` on export', () => {
    const spy = spyOn(electron.remote.dialog, 'showSaveDialog');
    spyOn(electron.remote, 'getCurrentWindow').and.returnValue(
      'current window!'
    );

    service.showExportDialog();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      'current window!',
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('exports to a file', () => {
    const spy = spyOn(electron.fs, 'writeJson');
    const filename = 'foobar.json';

    (service as any).exportToFile(filename);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(filename, {
      name: 'foobar',
      version: 1,
      packages: [testBepInExPackPackage.installedVersion.fullName]
    });
  });

  it('does nothing if export dialog is closed', () => {
    const spy = spyOn(electron.fs, 'writeJson');

    (service as any).exportToFile();

    expect(spy).toHaveBeenCalledTimes(0);
  });
});
