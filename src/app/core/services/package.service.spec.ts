import { TestBed } from '@angular/core/testing';

import { PackageService } from './package.service';
import { ElectronService } from './electron.service';
import {
  MockElectronService,
  MockDownloadService,
  MockPreferencesService,
  MockThunderstoreService
} from './mocks';
import { DownloadService } from './download.service';
import { testPackage } from '../models/package.model.spec';
import { PreferencesService } from './preferences.service';
import { ThunderstoreService } from './thunderstore.service';
import { DatabaseService } from './database.service';

describe('PackageService', () => {
  let service: PackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PackageService,
        DatabaseService,
        { provide: ElectronService, useClass: MockElectronService },
        { provide: DownloadService, useClass: MockDownloadService },
        { provide: PreferencesService, useClass: MockPreferencesService },
        { provide: ThunderstoreService, useClass: MockThunderstoreService }
      ]
    });

    const electron: MockElectronService = TestBed.get(ElectronService);
    const download: MockDownloadService = TestBed.get(DownloadService);
    spyOn(electron.ipcRenderer, 'send');
    spyOn(electron.ipcRenderer, 'on');
    spyOn(download, 'download');
  });

  beforeEach(() => {
    service = TestBed.get(PackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should install a package', async () => {
    await service.installPackage(testPackage.latestVersion);
    service.allPackages$.subscribe(packages => {
      expect(packages.filter(p => p.installedVersion).length).toBe(1);
    });
  });
});
