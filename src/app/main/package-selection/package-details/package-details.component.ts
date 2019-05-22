import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Package, PackageVersion } from '../../../core/models/package.model';
import { PreferencesService } from '../../../core/services/preferences.service';
import { Subscription } from 'rxjs';
import {
  PackageService,
  SelectablePackage
} from '../../services/package.service';
import { ElectronService } from '../../../core/services/electron.service';
import { PackageTableComponent } from '../package-table/package-table.component';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss']
})
export class PackageDetailsComponent implements OnInit, OnDestroy {
  @Input() table: PackageTableComponent;

  package: SelectablePackage;
  packageVersion: PackageVersion;

  shouldHumanize = this.prefs.get('humanizePackageNames');

  private subscription = new Subscription();

  constructor(
    private prefs: PreferencesService,
    private packages: PackageService,
    private electron: ElectronService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.prefs.onChange('humanizePackageNames').subscribe(event => {
        this.shouldHumanize = event.newValue;
      })
    );

    this.subscription.add(
      this.packages.selectedPackage.subscribe(pkg => {
        this.package = pkg;
        this.packageVersion = pkg && pkg.latestVersion;
      })
    );
  }

  showDetails(pkg: Package) {
    this.packages.selectedPackage.next(pkg);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openPackage() {
    this.electron.remote.shell.openExternal(this.package.packageUrl);
  }

  close() {
    this.packages.selectedPackage.next(null);
  }

  selectVersion(ver: PackageVersion) {
    this.package.selectedVersion = ver;
    this.table.onSelectedVersionChange(this.package);
  }
}
