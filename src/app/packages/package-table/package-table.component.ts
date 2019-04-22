import { AfterViewInit, Component, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { PackageTableDataSource } from './package-table-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { Package } from '../../core/models/package.model';
import { ThunderstoreService } from '../../core/services/thunderstore.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-package-table',
  templateUrl: './package-table.component.html',
  styleUrls: ['./package-table.component.scss']
})
export class PackageTableComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: PackageTableDataSource;
  isLoading: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'id', 'name'];
  selection = new SelectionModel<Package>(true, []);

  private subscription = new Subscription();

  constructor(public thunderstore: ThunderstoreService) {}

  ngAfterViewInit() {
    // FIXME this is a band-aid and we should really solve this in a smarter way
    setTimeout(() => {
      this.dataSource = new PackageTableDataSource(
        this.paginator,
        this.sort,
        this.thunderstore
      );
      this.dataSource.loading$.subscribe(loading => {
        this.isLoading = loading;
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isAllSelected() {
    if (!this.dataSource) {
      return false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not selected, otherwise clear selection */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  checkboxLabel(row?: Package): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    } else {
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
    }
  }
}
