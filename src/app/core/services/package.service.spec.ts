import { TestBed } from '@angular/core/testing';

import { PackageService } from './package.service';
import { ElectronService } from './electron.service';
import { MockElectronService, MockDownloadService } from './mocks';
import { DownloadService } from './download.service';
import { testPackage } from '../models/package.model.spec';

describe('PackageService', () => {
  let service: PackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PackageService,
        { provide: ElectronService, useClass: MockElectronService },
        { provide: DownloadService, useClass: MockDownloadService }
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

  it('should install a package', () => {
    service.installPackage(testPackage.latest_version);
    service.installedPackages$.subscribe(packages => {
      expect(packages.length).toBe(1);
    });
  });
});
