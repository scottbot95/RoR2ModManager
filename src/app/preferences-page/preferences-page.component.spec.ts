import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesPageComponent } from './preferences-page.component';

describe('PreferencesPageComponent', () => {
  let component: PreferencesPageComponent;
  let fixture: ComponentFixture<PreferencesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferencesPageComponent ]
    })
    .compileComponents();
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
