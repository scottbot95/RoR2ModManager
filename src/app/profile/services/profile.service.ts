import { Injectable } from '@angular/core';
import { ElectronService } from '../../core/services/electron.service';
import { PackageService } from '../../core/services/package.service';
import { Package } from '../../core/models/package.model';
import { PROFILE_EXTENSIONS } from '../constants';

@Injectable()
export class ProfileService {
  private allPackages: Package[] = [];

  constructor(
    private electron: ElectronService,
    private packages: PackageService
  ) {
    this.exportToFile = this.exportToFile.bind(this);
    this.packages.allPackages$.subscribe(pkgs => {
      if (Array.isArray(pkgs) && pkgs.length > 0) {
        this.allPackages = pkgs;
      }
    });
  }

  public registerMenuHandlers() {
    this.electron.ipcRenderer.on('importProfile', this.showImportDialog);

    this.electron.ipcRenderer.on('exportProfile', this.showExportDialog);
  }

  public showImportDialog() {
    this.electron.ipcRenderer.send('openDialog', 'importProfile', true);
  }

  public showExportDialog() {
    this.electron.remote.dialog.showSaveDialog(
      this.electron.remote.getCurrentWindow(),
      {
        filters: PROFILE_EXTENSIONS
      },
      this.exportToFile
    );
  }

  private async exportToFile(filename: string) {
    if (filename === undefined) return;
    const installed = this.allPackages
      .filter(p => p.installedVersion)
      .map(p => p.installedVersion.fullName);
    console.log('Writing profile file', installed);
    try {
      await this.electron.fs.remove(filename);
    } catch {}
    await this.electron.fs.writeJson(filename, installed);
  }
}
