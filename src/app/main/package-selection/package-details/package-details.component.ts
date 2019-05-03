import { Component, OnInit, OnDestroy } from '@angular/core';
import { Package, PackageVersion } from '../../../core/models/package.model';
import { PreferencesService } from '../../../core/services/preferences.service';
import { Subscription } from 'rxjs';
import { PackageService } from '../../../core/services/package.service';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss']
})
export class PackageDetailsComponent implements OnInit, OnDestroy {
  package: Package;
  packageVersion: PackageVersion;

  shouldHumanize = this.prefs.get('humanizePackageNames');

  private subscription = new Subscription();

  constructor(
    private prefs: PreferencesService,
    private packages: PackageService
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
}
