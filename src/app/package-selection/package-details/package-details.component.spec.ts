import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailsComponent } from './package-details.component';
import { MaterialModule } from '../../shared/material.module';
import { Component } from '@angular/core';
import { HumanizePipe } from '../../shared/humanize.pipe';
import { PreferencesService } from '../../core/services/preferences.service';
import {
  MockPreferencesService,
  MockPackageService
} from '../../core/services/mocks';
import { PackageService } from '../../core/services/package.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'markdown',
  template: '<ng-content></ng-content>'
})
class MockMarkdownComponent {}

describe('PackageDetailsComponent', () => {
  let component: PackageDetailsComponent;
  let fixture: ComponentFixture<PackageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PackageDetailsComponent,
        MockMarkdownComponent,
        HumanizePipe
      ],
      imports: [MaterialModule],
      providers: [
        { provide: PreferencesService, useClass: MockPreferencesService },
        { provide: PackageService, useClass: MockPackageService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
