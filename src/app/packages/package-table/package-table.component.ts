import {
  AfterViewInit,
  Component,
  ViewChild,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { PackageTableDataSource } from './package-table-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Package,
  InstalledPackage,
  InstalledPackageList
} from '../../core/models/package.model';
import { ThunderstoreService } from '../../core/services/thunderstore.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PackageChangeset } from '../../core/services/package.service';

@Component({
  selector: 'app-package-table',
  templateUrl: './package-table.component.html',
  styleUrls: ['./package-table.component.scss']
})
export class PackageTableComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() applyChanges: (selection: PackageChangeset) => void;
  @Input() installedPackages: InstalledPackageList;
  @Output() showPackageDetails = new EventEmitter<Package>();
  dataSource: PackageTableDataSource;
  isLoading: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'name', 'author', 'updated', 'latest'];
  selection = new SelectionModel<Package>(true, []);

  private subscription = new Subscription();
  private changes = new PackageChangeset();

  constructor(public thunderstore: ThunderstoreService) {}

  ngAfterViewInit() {
    // FIXME this is a band-aid and we should really solve this in a smarter way
    setTimeout(() => {
      this.dataSource = new PackageTableDataSource(
        this.paginator,
        this.sort,
        this.thunderstore
      );

      this.subscription.add(
        this.dataSource.loading$.pipe(delay(0)).subscribe(loading => {
          this.isLoading = loading;
        })
      );
    });

    // update selected status for datasource sorting feature
    this.subscription.add(
      this.selection.changed.subscribe(changed => {
        changed.added.forEach(pkg => {
          pkg.selected = true;
        });
        changed.removed.forEach(pkg => {
          pkg.selected = false;
        });
      })
    );
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
    const installed = this.installedPackages.find(p => p.uuid4 === pkg.uuid4);

    let dirty: boolean;
    if (installed !== undefined) {
      dirty =
        this.selection.isSelected(pkg) &&
        pkg.latest_version.version_number >
          installed.installed_version.version_number;
    } else {
      dirty = this.selection.isSelected(pkg);
    }
    if (dirty) {
      if (this.selection.isSelected(pkg)) {
        this.changes.updated.add(pkg.latest_version);
        this.changes.removed.delete(pkg);
      } else {
        this.changes.removed.add(pkg);
        this.changes.updated.delete(pkg.latest_version);
      }
    }
    return dirty;
  }

  handleApplyChanges() {
    this.applyChanges(this.changes);
    this.changes = new PackageChangeset();
  }
}
