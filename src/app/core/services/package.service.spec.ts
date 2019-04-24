import { TestBed } from '@angular/core/testing';

import { PackageService } from './package.service';
import { ElectronService } from './electron.service';
import { MockElectronService, MockDownloadService } from './mocks';
import { DownloadService } from './download.service';

describe('PackageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PackageService,
        { provide: ElectronService, useClass: MockElectronService },
        { provide: DownloadService, useClass: MockDownloadService }
      ]
    });

    const electron: MockElectronService = TestBed.get(ElectronService);
    spyOn(electron.ipcRenderer, 'send');
    spyOn(electron.ipcRenderer, 'on');
  });

  it('should be created', () => {
    const service: PackageService = TestBed.get(PackageService);
    expect(service).toBeTruthy();
  });
});
