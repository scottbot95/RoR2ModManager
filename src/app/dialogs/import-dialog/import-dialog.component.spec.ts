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
  MockBrowserWindow
} from '../../core/services/mocks.spec';
import { PackageService } from '../../core/services/package.service';
import { testPackageVersion } from '../../core/models/package.model.spec';

describe('ImportDialogComponent', () => {
  let component: ImportDialogComponent;
  let fixture: ComponentFixture<ImportDialogComponent>;
  let dialogSpy: jasmine.Spy, jsonSpy: jasmine.Spy, findSpy: jasmine.Spy;
  let electron: ElectronService;
  let service: PackageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportDialogComponent],
      imports: [MatListModule, MatFormFieldModule, MatDialogModule],
      providers: [
        { provide: ElectronService, useClass: MockElectronService },
        { provide: PackageService, useClass: MockPackageService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    electron = TestBed.get(ElectronService);
    service = TestBed.get(PackageService);
    dialogSpy = spyOn(electron.remote.dialog, 'showOpenDialog');
    jsonSpy = spyOn(electron.fs, 'readJson').and.returnValue([
      'author-TestPackage-1.0.0'
    ]);
    findSpy = spyOn(service, 'findPackageFromDependencyString').and.returnValue(
      testPackageVersion
    );

    spyOn(electron.remote, 'getCurrentWindow').and.returnValue(
      new MockBrowserWindow()
    );

    spyOn(electron.ipcRenderer, 'sendTo');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show open dialog on browse click', () => {
    component.showOpenDialog();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should parse selected json', async () => {
    component.showOpenDialog();
    const cb = dialogSpy.calls.mostRecent().args[2];
    await cb(['fakefile.json']);
    expect(jsonSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalled();
  });

  it('should show json parse error', async () => {
    const testError = new Error('failed to parse json');
    testError.name = 'SyntaxError';

    // spyOn(electron.fs, 'readJ')
    jsonSpy.and.callFake(() => {
      throw testError;
    });

    component.showOpenDialog();
    const cb = dialogSpy.calls.mostRecent().args[2];
    await cb(['fakefile.json']);

    expect(jsonSpy).toHaveBeenCalled();

    expect(component.errors.length).toBe(1);
  });

  it('should install profile on close', async () => {
    const spy = spyOn(service, 'installProfile');
    const testProfile = ['author-TestPackage-1.0.0'];
    (component as any).profile = testProfile;

    await component.handleClose();

    expect(spy).toHaveBeenCalledWith(testProfile, jasmine.anything());
  });

  it('should close dialog and focus parent after applying', async () => {
    const dialog = electron.remote.getCurrentWindow();
    const closeSpy = spyOn(dialog, 'close');
    const focusSpy = spyOn(dialog.getParentWindow(), 'focus');

    await component.handleClose();

    expect(closeSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
  });
});
