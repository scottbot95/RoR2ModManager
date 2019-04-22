import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';

import { PackageTableComponent } from './package-table.component';
import { MaterialModule } from '../../shared/material.module';

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
      ]
    }).compileComponents();
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
