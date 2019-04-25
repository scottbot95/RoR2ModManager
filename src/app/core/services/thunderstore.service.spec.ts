import { TestBed } from '@angular/core/testing';

import { ThunderstoreService } from './thunderstore.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MockHttpClient } from './mocks';
import { DatabaseService } from './database.service';

describe('ThunderstoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThunderstoreService,
        DatabaseService,
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    });

    const http: MockHttpClient = TestBed.get(HttpClient);
    spyOn(http, 'get').and.returnValue(of([]));
  });

  it('should be created', () => {
    const service: ThunderstoreService = TestBed.get(ThunderstoreService);
    expect(service).toBeTruthy();
  });
});
