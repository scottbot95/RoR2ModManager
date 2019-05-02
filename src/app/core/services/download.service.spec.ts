import { TestBed } from '@angular/core/testing';

import { DownloadService } from './download.service';
import { ElectronService } from './electron.service';
import { MockElectronService } from './mocks.spec';

describe('DownloadService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        DownloadService,
        { provide: ElectronService, useClass: MockElectronService }
      ]
    })
  );

  it('should be created', () => {
    const service: DownloadService = TestBed.get(DownloadService);
    expect(service).toBeTruthy();
  });
});
