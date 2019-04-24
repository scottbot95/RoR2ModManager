import {
  AfterViewInit,
  Component,
  ViewChild,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { PackageTableDataSource } from './package-table-datasource';
import {
  Package,
  PackageList,
  PackageVersion,
  PackageVersionList
} from '../../core/models/package.model';
import { ThunderstoreService } from '../../core/services/thunderstore.service';
import { Subscription, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PackageChangeset } from '../../core/services/package.service';
import { SelectionChangesetModel } from '../../shared/selection-changeset';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-package-table',
  templateUrl: './package-table.component.html',
  styleUrls: ['./package-table.component.scss']
})
export class PackageTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() applyChanges: (selection: PackageChangeset) => void;
  @Input() installedPackages: Observable<PackageList>;
  @Output() showPackageDetails = new EventEmitter<Package>();
  dataSource: PackageTableDataSource;
  isLoading: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'name', 'author', 'updated', 'latest'];
  selection: SelectionChangesetModel<Package>;

  filter = new FormControl('');

  private subscription = new Subscription();
  private _installedPackages: PackageList;

  constructor(public thunderstore: ThunderstoreService) {}

  ngOnInit() {
    this.selection = new SelectionChangesetModel<Package>(
      true,
      this.installedPackages
    );

    // update selected status for datasource sorting feature
    this.subscription.add(
      this.selection.changed.pipe(delay(0)).subscribe(changed => {
        changed.added.forEach(pkg => {
          pkg.selected = true;
          this.selectAllDependencies(pkg.latest_version);
        });
        changed.removed.forEach(pkg => {
          pkg.selected = false;
          this.deselectAvailDependencies(pkg.latest_version);
        });
      })
    );

    this.subscription.add(
      this.installedPackages.subscribe(pkgs => {
        this._installedPackages = pkgs;
      })
    );
  }

  ngAfterViewInit() {
    // FIXME this is a band-aid and we should really solve this in a smarter way
    setTimeout(() => {
      this.dataSource = new PackageTableDataSource(
        this.paginator,
        this.sort,
        this.filter,
        this.thunderstore
      );

      this.subscription.add(
        this.dataSource.loading$.pipe(delay(0)).subscribe(loading => {
          this.isLoading = loading;
        })
      );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkboxLabel(row: Package): string {
    return `${this.selection.isSelected(row) ? 'Uninstall' : 'Install'} ${
      row.name
    }`;
  }

  showDetails(pkg: Package) {
    this.showPackageDetails.emit(pkg);
  }

  isRowDirty(pkg: Package) {
    const installed = this._installedPackages.find(p => p.uuid4 === pkg.uuid4);

    let dirty: boolean;
    if (installed !== undefined) {
      dirty = !this.selection.isSelected(pkg);
    } else {
      dirty = this.selection.isSelected(pkg);
    }
    return dirty;
  }

  handleApplyChanges() {
    const changeset = this.selection.getChangeset();
    const changes = new PackageChangeset();
    changes.removed = changeset.removed;
    changes.updated = new Set(
      Array.from(changeset.added).map(pkg => pkg.latest_version)
    );
    this.applyChanges(changes);
  }

  private selectAllDependencies(pkg: PackageVersion) {
    const toSelect: PackageVersionList = [];
    pkg.dependencies.forEach(dep => {
      const depVer = this.getDependecyFromString(dep);
      depVer.pkg.requiredBy.add(pkg);

      toSelect.push(depVer);
    });

    if (toSelect.length) this.selection.select(...toSelect.map(p => p.pkg));
  }

  private deselectAvailDependencies(pkg: PackageVersion) {
    const toDeselct: PackageVersionList = [];

    pkg.dependencies.forEach(dep => {
      const depVer = this.getDependecyFromString(dep);
      const depPkg = depVer.pkg;

      depPkg.requiredBy.delete(pkg);
      if (depPkg.requiredBy.size === 0) {
        toDeselct.push(depVer);
      }
    });

    if (toDeselct.length) this.selection.deselect(...toDeselct.map(p => p.pkg));
  }

  private getDependecyFromString(dep: string) {
    const [author, name, version] = dep.split('-');
    const depPkg = this.dataSource.data.find(
      p => p.owner === author && p.name === name
    );
    const depVer = depPkg.versions.find(v => v.version_number === version);
    return depVer;
  }
}
