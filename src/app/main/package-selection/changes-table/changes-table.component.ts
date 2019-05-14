import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { PackageService } from '../../../core/services/package.service';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource, MatSort } from '@angular/material';
import { PreferencesService } from '../../../core/services/preferences.service';

interface TableRow {
  name: string;
  author: string;
  action: 'install' | 'uninstall';
  installedVersion?: string;
  versionToInstall?: string;
}

@Component({
  selector: 'app-changes-table',
  templateUrl: './changes-table.component.html',
  styleUrls: ['./changes-table.component.scss']
})
export class ChangesTableComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private packages: PackageService,
    private prefs: PreferencesService
  ) {}

  public displayedColumns = [
    'name',
    'author',
    'action',
    'installedVersion',
    'versionToInstall'
  ];

  @ViewChild(MatSort) sort: MatSort;

  public readonly dataSource = new MatTableDataSource([]);

  public shouldHumanize = this.prefs.get('humanizePackageNames');

  private subscription = new Subscription();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.subscription.add(
      this.prefs.onChange('humanizePackageNames').subscribe(val => {
        this.shouldHumanize = val.newValue;
      })
    );

    this.subscription.add(
      this.packages.pendingChanges.subscribe(changeset => {
        this.dataSource.data = [
          ...Array.from(changeset.updated).map(
            (ver): TableRow => ({
              action: 'install',
              name: ver.name,
              author: ver.pkg.owner,
              versionToInstall: ver.version.version,
              installedVersion:
                ver.pkg.installedVersion &&
                ver.pkg.installedVersion.version.version
            })
          ),
          ...Array.from(changeset.removed).map(
            (pkg): TableRow => ({
              action: 'uninstall',
              name: pkg.name,
              author: pkg.owner,
              installedVersion: pkg.installedVersion.version.version
            })
          )
        ];
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
