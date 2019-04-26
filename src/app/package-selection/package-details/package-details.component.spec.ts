import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailsComponent } from './package-details.component';
import { MaterialModule } from '../../shared/material.module';
import { Component } from '@angular/core';
import { Package } from '../../core/models/package.model';
import { By } from '@angular/platform-browser';
import { testPackage } from '../../core/models/package.model.spec';
import { HumanizePipe } from '../../shared/humanize.pipe';
import { PreferencesService } from '../../core/services/preferences.service';
import { MockPreferencesService } from '../../core/services/mocks';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'markdown',
  template: '<ng-content></ng-content>'
})
class MockMarkdownComponent {}

@Component({
  selector: 'app-host-component',
  template:
    '<app-package-details [package]="testPackage"></app-package-details>'
})
class TestHostComponent {
  testPackage: Package = testPackage;
}

describe('PackageDetailsComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let component: PackageDetailsComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PackageDetailsComponent,
        MockMarkdownComponent,
        TestHostComponent,
        HumanizePipe
      ],
      imports: [MaterialModule],
      providers: [
        { provide: PreferencesService, useClass: MockPreferencesService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
    component = testHostFixture.debugElement.query(
      By.directive(PackageDetailsComponent)
    ).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
