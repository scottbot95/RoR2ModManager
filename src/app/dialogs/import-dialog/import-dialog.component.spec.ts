import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDialogComponent } from './import-dialog.component';
import {
  MatListModule,
  MatFormFieldModule,
  MatDialogModule
} from '@angular/material';
import { ElectronService } from '../../core/services/electron.service';
import {
  MockElectronService,
  MockPackageService,
  MockChangeDetectorRef
} from '../../core/services/mocks.spec';
import { PackageService } from '../../core/services/package.service';
import { ChangeDetectorRef } from '@angular/core';

describe('ImportDialogComponent', () => {
  let component: ImportDialogComponent;
  let fixture: ComponentFixture<ImportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportDialogComponent],
      imports: [MatListModule, MatFormFieldModule, MatDialogModule],
      providers: [
        { provide: ElectronService, useClass: MockElectronService },
        { provide: PackageService, useClass: MockPackageService },
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
