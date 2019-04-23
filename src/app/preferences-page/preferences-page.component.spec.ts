import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesPageComponent } from './preferences-page.component';
import { PreferencesService } from '../core/services/preferences.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MockPreferencesService } from '../core/services/mocks';

describe('PreferencesPageComponent', () => {
  let component: PreferencesPageComponent;
  let fixture: ComponentFixture<PreferencesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreferencesPageComponent],
      imports: [SharedModule, ReactiveFormsModule],
      providers: [
        { provide: PreferencesService, useClass: MockPreferencesService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
