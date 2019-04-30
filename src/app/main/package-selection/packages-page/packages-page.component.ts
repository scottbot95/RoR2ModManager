import { Component, OnInit } from '@angular/core';
import {
  PackageService,
  PackageChangeset
} from '../../../core/services/package.service';
import { Observable } from 'rxjs';
import { PackageList, Package } from '../../../core/models/package.model';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-packages-page',
  templateUrl: './packages-page.component.html',
  styleUrls: ['./packages-page.component.scss'],
  host: {
    style: 'display:flex;flex-direction:column;flex-grow:1;'
  }
})
export class PackagesPageComponent implements OnInit {
  installedPackages$: Observable<
    PackageList
  > = this.service.installedPackages$.pipe(
    tap(pkgs => console.log(pkgs)),
    map(pkgs => pkgs.map(pkg => pkg.installedVersion.pkg))
  );

  selectedPackage: Observable<Package>;

  constructor(private service: PackageService) {}

  ngOnInit() {
    this.selectedPackage = this.service.selectedPackage;
  }

  applyChanges = (changes: PackageChangeset) => {
    // install new packages
    this.service.applyChanges(changes);
  };
}
