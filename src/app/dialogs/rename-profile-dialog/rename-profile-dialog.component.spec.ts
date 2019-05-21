import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameProfileDialogComponent } from './rename-profile-dialog.component';
import { DialogService } from '../services/dialog.service';
import { MockDialogService } from '../../core/services/mocks.spec';

describe('RenameProfileDialogComponent', () => {
  let component: RenameProfileDialogComponent;
  let fixture: ComponentFixture<RenameProfileDialogComponent>;
  let readySpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RenameProfileDialogComponent],
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
