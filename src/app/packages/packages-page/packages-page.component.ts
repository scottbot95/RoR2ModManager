import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  PackageService,
  PackageChangeset
} from '../../core/services/package.service';
import { Subscription, Observable } from 'rxjs';
import { Package, PackageList } from '../../core/models/package.model';
import { map } from 'rxjs/operators';

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
  selectedPackage: Package;
  installedPackages$: Observable<
    PackageList
  > = this.service.installedPackages$.pipe(
    map(pkgs => pkgs.map(pkg => pkg.installed_version.pkg))
  );

  constructor(private service: PackageService) {}

  ngOnInit() {
    this.subscription.add(
      this.service.installedPackages$.subscribe(pkgs => {
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
