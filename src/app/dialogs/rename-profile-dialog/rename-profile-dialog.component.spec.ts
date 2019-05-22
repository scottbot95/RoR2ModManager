import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameProfileDialogComponent } from './rename-profile-dialog.component';
import { DialogService } from '../services/dialog.service';
import { MockDialogService } from '../../core/services/mocks.spec';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { MatDialogModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RenameProfileDialogComponent', () => {
  let component: RenameProfileDialogComponent;
  let fixture: ComponentFixture<RenameProfileDialogComponent>;
  let readySpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RenameProfileDialogComponent],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [{ provide: DialogService, useClass: MockDialogService }]
    }).compileComponents();

    const dialogService: DialogService = TestBed.get(DialogService);
    readySpy = spyOn(dialogService, 'dialogReady');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger `dialogReady` onInit', () => {
    expect(readySpy).toHaveBeenCalled();
  });
});
