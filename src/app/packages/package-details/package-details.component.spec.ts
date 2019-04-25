import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailsComponent } from './package-details.component';
import { MaterialModule } from '../../shared/material.module';
import { Component } from '@angular/core';
import { ApiPackage } from '../../core/models/package.model';
import { By } from '@angular/platform-browser';
import { testPackage } from '../../core/models/package.model.spec';

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
  testPackage: ApiPackage = testPackage;
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
