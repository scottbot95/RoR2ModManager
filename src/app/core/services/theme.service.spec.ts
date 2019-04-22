import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { PreferencesService } from './preferences.service';
import { MockPreferencesService } from './mocks';

describe('ThemeService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PreferencesService, useClass: MockPreferencesService }
      ]
    })
  );

  it('should be created', () => {
    const service: ThemeService = TestBed.get(ThemeService);
    expect(service).toBeTruthy();
  });
});
