import { TestBed } from '@angular/core/testing';

import { DialogService } from './dialog.service';
import { ElectronService } from '../../core/services/electron.service';
import { MockElectronService } from '../../core/services/mocks.spec';
import { RouterTestingModule } from '@angular/router/testing';

describe('DialogService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        DialogService,
        { provide: ElectronService, useClass: MockElectronService }
      ]
    })
  );

  it('should be created', () => {
    const service: DialogService = TestBed.get(DialogService);
    expect(service).toBeTruthy();
  });
});
