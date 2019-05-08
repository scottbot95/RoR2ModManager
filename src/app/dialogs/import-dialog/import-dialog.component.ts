import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from '../../core/services/electron.service';
import { PackageVersionList } from '../../core/models/package.model';
import { PackageService } from '../../core/services/package.service';
import { PROFILE_EXTENSIONS } from '../../profile/constants';
import { PackageProfile } from '../../core/models/profile.model';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit {
  packages: PackageVersionList;
  errors: string[] = [];

  private profile: PackageProfile;

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
            this.errors = [];
            const profile: PackageProfile = await this.electron.fs.readJson(
              path
            );
            this.packages = profile
              .map(dep => {
                try {
                  return this.service.findPackageFromDependencyString(dep);
                } catch (err) {
                  if (
                    err.name === 'PackageSourceEmptyError' ||
                    err.name === 'PackageNotFoundError'
                  ) {
                    this.errors.push(err.message);
                  }
                }
              })
              .filter(p => p); // prune falsy elements
            this.profile = profile;

            console.log('Loaded valid profile file', this.packages);
          } catch (err) {
            switch (err.name) {
              case 'SyntaxError':
                this.errors = ['Cannot parse profile file'];
                break;
              default:
                this.errors = [err.message || err];
                break;
            }
            this.packages = undefined;
            this.profile = [];
          } finally {
            this.changeDetector.detectChanges();
          }
        }
      }
    );
  }

  async handleClose() {
    if (this.profile) {
      await this.service.installProfile(this.profile, true);
    }
    this.electron.ipcRenderer.sendTo(
      this.electron.remote.getCurrentWindow().getParentWindow().webContents.id,
      'refreshPackages'
    );
    this.electron.remote
      .getCurrentWindow()
      .getParentWindow()
      .focus();
    this.electron.remote.getCurrentWindow().close();
  }
}
