import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { HttpClient } from '@angular/common/http';

import { PackageTableComponent } from './package-table.component';
import { MaterialModule } from '../../shared/material.module';
import { ThunderstoreService } from '../../core/services/thunderstore.service';
import { of } from 'rxjs';
import { ElectronService } from '../../core/services/electron.service';
import { MockHttpClient } from '../../core/services/mocks';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-test-host',
  template:
    '<app-package-table [installedPackages]="installedPackages"></app-package-table>'
})
class TestHostComponent {
  installedPackages = of([]);
}

describe('PackageTableComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let component: PackageTableComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PackageTableComponent, TestHostComponent],
      imports: [
        NoopAnimationsModule,
        MaterialModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule
      ],
      providers: [
        ThunderstoreService,
        ElectronService,
        { provide: HttpClient, useClass: MockHttpClient }
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
