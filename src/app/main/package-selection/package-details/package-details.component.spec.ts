import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailsComponent } from './package-details.component';
import { MaterialModule } from '../../../shared/material.module';
import { Component } from '@angular/core';
import { HumanizePipe } from '../../../shared/humanize.pipe';
import { PreferencesService } from '../../../core/services/preferences.service';
import {
  MockPreferencesService,
  MockPackageService,
  MockElectronService
} from '../../../core/services/mocks.spec';
import { PackageService } from '../../services/package.service';
import { ElectronService } from '../../../core/services/electron.service';

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
        { provide: PackageService, useClass: MockPackageService },
        { provide: ElectronService, useClass: MockElectronService }
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
