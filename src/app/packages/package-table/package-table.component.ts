import {
  AfterViewInit,
  Component,
  ViewChild,
  OnDestroy,
  Input
} from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { PackageTableDataSource } from './package-table-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { Package } from '../../core/models/package.model';
import { ThunderstoreService } from '../../core/services/thunderstore.service';
import { Subscription } from 'rxjs';
import { PackageService } from '../../core/services/package.service';

@Component({
  selector: 'app-package-table',
  templateUrl: './package-table.component.html',
  styleUrls: ['./package-table.component.scss']
})
export class PackageTableComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() applyChanges: (selection: SelectionModel<Package>) => any;
  @Input() installedPackages: Set<Package>;
  dataSource: PackageTableDataSource;
  isLoading: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'id', 'name', 'author', 'updated', 'latest'];
  selection = new SelectionModel<Package>(true, []);

  private subscription = new Subscription();

  constructor(
    public thunderstore: ThunderstoreService,
    public service: PackageService
  ) {}

  ngAfterViewInit() {
    // FIXME this is a band-aid and we should really solve this in a smarter way
    setTimeout(() => {
      this.dataSource = new PackageTableDataSource(
        this.paginator,
        this.sort,
        this.thunderstore
      );

      this.subscription.add(
        this.dataSource.loading$.subscribe(loading => {
          this.isLoading = loading;
        })
      );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkboxLabel(row: Package): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  // applyChanges() {
  //   this.selection.selected.forEach(pkg => {
  //     if (!this.installed.has(pkg)) {
  //       this.service.installPackage(pkg, pkg.latest_version);
  //     }
  //   });

  //   this.installed.forEach(pkg => {
  //     if (!this.selection.isSelected(pkg)) {
  //       this.service.uninstallPackage(pkg, pkg.latest_version);
  //     }
  //   });
  // }
}
