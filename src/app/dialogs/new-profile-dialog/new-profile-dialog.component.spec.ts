import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProfileDialogComponent } from './new-profile-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { MatDialogModule } from '@angular/material';
import { ProfileService } from '../../profile/services/profile.service';
import {
  MockProfileService,
  MockElectronService,
  MockDialogService,
  MockTranslatePipe
} from '../../core/services/mocks.spec';
import { ElectronService } from '../../core/services/electron.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogService } from '../services/dialog.service';

describe('NewProfileDialogComponent', () => {
  let component: NewProfileDialogComponent;
  let fixture: ComponentFixture<NewProfileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewProfileDialogComponent, MockTranslatePipe],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ProfileService, useClass: MockProfileService },
        { provide: ElectronService, useClass: MockElectronService },
        { provide: DialogService, useClass: MockDialogService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
