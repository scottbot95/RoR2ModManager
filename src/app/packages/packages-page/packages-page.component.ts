import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  PackageService,
  PackageChangeset
} from '../../core/services/package.service';
import { Subscription } from 'rxjs';
import { Package, InstalledPackageList } from '../../core/models/package.model';

@Component({
  selector: 'app-packages-page',
  templateUrl: './packages-page.component.html',
  styleUrls: ['./packages-page.component.scss'],
  host: {
    style: 'display:flex;flex-direction:column;flex-grow:1;'
  }
})
export class PackagesPageComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  installedPackages: InstalledPackageList = [];
  selectedPackage: Package;

  constructor(private service: PackageService) {}

  ngOnInit() {
    this.subscription.add(
      this.service.installedPackages$.subscribe(pkgs => {
        this.installedPackages = pkgs;
        console.log(pkgs);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyChanges = (changes: PackageChangeset) => {
    // install new packages
    this.service.applyChanges(changes);
  };
}
