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
import { MockHttpClient } from '../../shared/helpers';
import { ThunderstoreService } from '../../core/services/thunderstore.service';
import { of } from 'rxjs';

describe('PackageTableComponent', () => {
  let component: PackageTableComponent;
  let fixture: ComponentFixture<PackageTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PackageTableComponent],
      imports: [
        NoopAnimationsModule,
        MaterialModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule
      ],
      providers: [
        ThunderstoreService,
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    }).compileComponents();

    const http = TestBed.get(HttpClient);
    spyOn(http, 'get').and.returnValue(of([]));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
