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
import { Package } from '../../core/models/package.model';
import { ThunderstoreService } from '../../core/services/thunderstore.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-package-table',
  templateUrl: './package-table.component.html',
  styleUrls: ['./package-table.component.scss']
})
export class PackageTableComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() applyChanges: (selection: SelectionModel<Package>) => void;
  @Input() installedPackages: Set<Package>;
  @Output() showPackageDetails = new EventEmitter<Package>();
  dataSource: PackageTableDataSource;
  isLoading: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'name', 'author', 'updated', 'latest'];
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
    console.log(pkg);
    this.showPackageDetails.emit(pkg);
  }
}
