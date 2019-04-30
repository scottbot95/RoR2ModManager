import { Injectable } from '@angular/core';
import { ElectronService } from '../../core/services/electron.service';
import { MatDialog } from '@angular/material';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { PackageService } from '../../core/services/package.service';
import { Package } from '../../core/models/package.model';

@Injectable()
export class ProfileService {
  private allPackages: Package[] = [];

  constructor(
    private electron: ElectronService,
    private dialog: MatDialog,
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
    this.electron.ipcRenderer.on('importProfile', event =>
      this.showImportDialog()
    );

    this.electron.ipcRenderer.on('exportProfile', event =>
      this.showExportDialog()
    );
  }

  public showImportDialog() {
    this.dialog.closeAll();
    this.dialog.open(ImportDialogComponent);
  }

  public showExportDialog() {
    this.electron.remote.dialog.showSaveDialog(
      this.electron.remote.getCurrentWindow(),
      {
        filters: [
          { name: 'Mod Profile', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      },
      this.exportToFile
    );
  }

  private async exportToFile(filename: string) {
    if (filename === undefined) return;
    const installed = this.allPackages
      .filter(p => p.installedVersion)
      .map(p => p.installedVersion.fullName);
    console.log('Writingn profile file', installed);
    try {
      await this.electron.fs.remove(filename);
    } catch {}
    await this.electron.fs.writeJson(filename, installed);
  }
}
