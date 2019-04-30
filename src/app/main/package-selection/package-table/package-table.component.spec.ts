import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { HttpClient } from '@angular/common/http';

import { PackageTableComponent } from './package-table.component';
import { MaterialModule } from '../../../shared/material.module';
import { ThunderstoreService } from '../../../core/services/thunderstore.service';
import { of } from 'rxjs';
import { ElectronService } from '../../../core/services/electron.service';
import {
  MockHttpClient,
  MockElectronService,
  MockPreferencesService,
  MockThunderstoreService,
  MockPackageService
} from '../../../core/services/mocks';
import { Component, Directive, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from '../../../core/services/database.service';
import { PreferencesService } from '../../../core/services/preferences.service';
import { HumanizePipe } from '../../../shared/humanize.pipe';
import { PackageService } from '../../../core/services/package.service';

@Component({
  selector: 'app-test-host',
  template:
    '<app-package-table [installedPackages]="installedPackages"></app-package-table>'
})
class TestHostComponent {
  installedPackages = of([]);
}

@Directive({
  selector: '[appFocusOnKeys]'
})
class MockFocusOnKeysDirective {
  @Input('appFocusOnKeys') key: any;
}

describe('PackageTableComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let component: PackageTableComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PackageTableComponent,
        TestHostComponent,
        MockFocusOnKeysDirective,
        HumanizePipe
      ],
      imports: [
        NoopAnimationsModule,
        MaterialModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        ReactiveFormsModule
      ],
      providers: [
        DatabaseService,
        { provide: ThunderstoreService, useClass: MockThunderstoreService },
        { provide: PreferencesService, useClass: MockPreferencesService },
        { provide: ElectronService, useClass: MockElectronService },
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: PackageService, useClass: MockPackageService }
      ]
    }).compileComponents();

    const http = TestBed.get(HttpClient);
    spyOn(http, 'get').and.returnValue(of([]));
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
    component = testHostFixture.debugElement.query(
      By.directive(PackageTableComponent)
    ).componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
