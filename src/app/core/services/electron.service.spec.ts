import { TestBed } from '@angular/core/testing';
import { ElectronService } from './electron.service';

describe('ElectronService', () => {
  let requireSpy: jasmine.Spy;
  let remoteRequireSpy: jasmine.Spy;

  beforeAll(() => {
    window.require = () => {};
    const mockElectron = {
      ipcRenderer: {},
      webFrame: {},
      remote: { require: () => {} }
    };
    remoteRequireSpy = spyOn(mockElectron.remote, 'require').and.returnValue(
      {}
    );
    requireSpy = spyOn(window, 'require').and.callFake((modName: string) => {
      if (modName === 'electron') return mockElectron;
      else return {};
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronService]
    });
  });

  it('should be created', () => {
    const electron: ElectronService = TestBed.get(ElectronService);
    expect(electron).toBeTruthy();
  });

  it('should detect if running in browser', () => {
    const electron: ElectronService = TestBed.get(ElectronService);
    expect(electron.isElectron()).toBeFalsy();
  });

  it('should detect if running in electron', () => {
    window.process = { type: 'renderer' };
    const electron: ElectronService = TestBed.get(ElectronService);
    expect(electron.isElectron()).toBeTruthy();
  });
});
