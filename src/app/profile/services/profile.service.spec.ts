import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import { ElectronService } from '../../core/services/electron.service';
import {
  MockElectronService,
  MockPackageService
} from '../../core/services/mocks';
import { PackageService } from '../../core/services/package.service';

describe('ProfileService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        { provide: ElectronService, useClass: MockElectronService },
        { provide: PackageService, useClass: MockPackageService }
      ]
    })
  );

  it('should be created', () => {
    const service: ProfileService = TestBed.get(ProfileService);
    expect(service).toBeTruthy();
  });
});
