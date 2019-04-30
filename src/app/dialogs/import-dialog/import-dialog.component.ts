import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from '../../core/services/electron.service';
import { PackageVersionList } from '../../core/models/package.model';
import { PackageService } from '../../core/services/package.service';
import { PROFILE_EXTENSIONS } from '../../profile/constants';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit {
  packages: PackageVersionList;
  errors: string[];

  constructor(
    private electron: ElectronService,
    private service: PackageService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  showOpenDialog() {
    this.electron.remote.dialog.showOpenDialog(
      this.electron.remote.getCurrentWindow(),
      { filters: PROFILE_EXTENSIONS },
      async files => {
        if (files) {
          const [path] = files;
          try {
            const depStrings: string[] = await this.electron.fs.readJson(path);
            this.packages = depStrings.map(dep =>
              this.service.findPackageFromDependencyString(dep)
            );
            console.log('Loaded valid profile file', this.packages);
          } catch (err) {
            console.warn(err);
            this.errors = [err.message || err];
            this.packages = undefined;
          } finally {
            this.changeDetector.detectChanges();
          }
        }
      }
    );
  }

  handleClose() {
    this.electron.remote
      .getCurrentWindow()
      .getParentWindow()
      .focus();
    this.electron.remote.getCurrentWindow().close();
  }
}
