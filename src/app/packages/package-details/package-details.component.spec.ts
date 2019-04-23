import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailsComponent } from './package-details.component';
import { MaterialModule } from '../../shared/material.module';
import { Component } from '@angular/core';
import { Package, PackageVersion } from '../../core/models/package.model';
import { By } from '@angular/platform-browser';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'markdown',
  template: '<ng-content></ng-content>'
})
class MockMarkdownComponent {}

const testPackageVersion: PackageVersion = {
  date_created: new Date(),
  dependencies: [],
  description: '',
  download_url: '',
  downloads: 0,
  icon: '',
  is_active: true,
  name: 'testPackage',
  uuid4: '',
  version_number: '1.0.0',
  website_url: '',
  full_name: 'author-testPackage-1.0.0'
};

@Component({
  selector: 'app-host-component',
  template:
    '<app-package-details [package]="testPackage"></app-package-details>'
})
class TestHostComponent {
  testPackage: Package = {
    date_created: new Date(),
    date_updated: new Date(),
    is_active: true,
    is_pinned: false,
    maintainers: [],
    name: 'TestPackage',
    owner: 'author',
    uuid4: '',
    full_name: ``,
    latest_version: testPackageVersion,
    versions: [testPackageVersion]
  };
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
        TestHostComponent
      ],
      imports: [MaterialModule]
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
