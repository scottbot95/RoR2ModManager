import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../core/services/package.service';
import { Subscription } from 'rxjs';
import { Package } from '../../core/models/package.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-packages-page',
  templateUrl: './packages-page.component.html',
  styleUrls: ['./packages-page.component.scss'],
  host: {
    class: 'flex col grow'
  }
})
export class PackagesPageComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  installedPackages = new Set<Package>();

  constructor(private service: PackageService) {}

  ngOnInit() {
    this.subscription.add(
      this.service.installedPackages$.subscribe(pkgs => {
        this.installedPackages = new Set(pkgs);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyChanges(selection: SelectionModel<Package>) {
    // install new packages
    selection.selected.forEach(pkg => {
      if (!this.installedPackages.has(pkg)) {
        this.service.installPackage(pkg, pkg.latest_version);
      }
    });

    // remove unwatned packages
    this.installedPackages.forEach(pkg => {
      if (!selection.isSelected(pkg)) {
        this.service.uninstallPackage(pkg);
      }
    });
  }
}
