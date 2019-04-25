import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesPageComponent } from './packages-page.component';
import { Component, Input } from '@angular/core';
import { ApiPackage } from '../../core/models/package.model';
import { PackageService } from '../../core/services/package.service';
import { MockPackageService } from '../../core/services/mocks';

@Component({
  selector: 'app-package-table',
  template: '<p>Mock Package Table Component</p>'
})
class MockPackageTableComponent {
  @Input() applyChanges: (...args: any[]) => void;
  @Input() installedPackages: Set<ApiPackage>;
  @Input() showDetails: (pkg: ApiPackage) => void;
}

@Component({
  selector: 'app-package-details',
  template: '<p>Mock Package Details Component</p>'
})
class MockPackageDetailsComponent {
  @Input() package: ApiPackage;
}

describe('PackagesPageComponent', () => {
  let component: PackagesPageComponent;
  let fixture: ComponentFixture<PackagesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PackagesPageComponent,
        MockPackageTableComponent,
        MockPackageDetailsComponent
      ],
      providers: [{ provide: PackageService, useClass: MockPackageService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
