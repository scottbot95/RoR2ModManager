import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesPageComponent } from './preferences-page.component';
import { PreferencesService } from '../../core/services/preferences.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import {
  MockPreferencesService,
  MockElectronService
} from '../../core/services/mocks.spec';
import { ElectronService } from '../../core/services/electron.service';
import { join } from 'path';
import { prefs } from '../../../../electron/prefs';

describe('PreferencesPageComponent', () => {
  let component: PreferencesPageComponent;
  let fixture: ComponentFixture<PreferencesPageComponent>;
  let prefSetSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreferencesPageComponent],
      imports: [SharedModule, ReactiveFormsModule],
      providers: [
        { provide: PreferencesService, useClass: MockPreferencesService },
        { provide: ElectronService, useClass: MockElectronService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    prefSetSpy = spyOn((component as any).prefs as typeof prefs, 'set');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates preferences on input changes', () => {
    component.darkMode.setValue(true);
    expect(prefSetSpy).toHaveBeenCalledWith('darkMode', true);

    component.respectPinned.setValue(true);
    expect(prefSetSpy).toHaveBeenCalledWith('respectPinned', true);

    component.humanizePackageNames.setValue(true);
    expect(prefSetSpy).toHaveBeenCalledWith('humanizePackageNames', true);

    component.checkForPackageUpdates.setValue(true);
    expect(prefSetSpy).toHaveBeenCalledWith('updatePackagesOnStart', true);
  });

  describe('RoR2 Path Dialog', () => {
    let openDialogSpy: jasmine.Spy;
    let messageDialogSpy: jasmine.Spy;
    let accessSpy: jasmine.Spy;

    beforeEach(() => {
      const electron: MockElectronService = TestBed.get(ElectronService);
      openDialogSpy = spyOn(electron.remote.dialog, 'showOpenDialog');
      messageDialogSpy = spyOn(electron.remote.dialog, 'showMessageBox');
      accessSpy = spyOn(electron.fs, 'access');
    });

    it('Checks that RoR2 path contains Risk of Rain 2.exe', () => {
      component.selectRoR2Path();

      expect(openDialogSpy).toHaveBeenCalled();

      const dialogCb = openDialogSpy.calls.mostRecent().args.slice(-1)[0];
      const testPath = '/fake/path/RoR2';
      dialogCb([testPath]);

      expect(accessSpy).toHaveBeenCalledWith(
        join(testPath, 'Risk of Rain 2.exe'),
        jasmine.any(Function)
      );
    });

    describe('Access result behavior', () => {
      let accessCb: Function;
      beforeEach(() => {
        component.selectRoR2Path();

        const dialogCb = openDialogSpy.calls.mostRecent().args.slice(-1)[0];
        const testPath = '/fake/path/RoR2';
        dialogCb([testPath]);

        accessCb = accessSpy.calls.mostRecent().args.slice(-1)[0];
      });

      it('shows an error message on error', () => {
        accessCb(new Error('fake error'));
        expect(messageDialogSpy).toHaveBeenCalledTimes(1);
      });

      it('Sets the preference if no error', () => {
        accessCb();
        expect(prefSetSpy).toHaveBeenCalledWith(
          'ror2_path',
          jasmine.any(String)
        );
      });
    });
  });
});
