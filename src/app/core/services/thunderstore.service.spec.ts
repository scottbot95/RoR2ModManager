import { TestBed } from '@angular/core/testing';

import { ThunderstoreService } from './thunderstore.service';

describe('ThunderstoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThunderstoreService = TestBed.get(ThunderstoreService);
    expect(service).toBeTruthy();
  });
});
