import {
  AfterViewInit,
  Component,
  ViewChild,
  OnDestroy,
  Input,
  OnInit,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import {
  PackageTableDataSource,
  calcPackageDirty
} from './package-table-datasource';
import {
  Package,
  PackageList,
  PackageVersion,
  PackageVersionList
} from '../../../core/models/package.model';
import {
  PackageChangeset,
  PackageService,
  SelectablePackge
} from '../../../core/services/package.service';
import { PreferencesService } from '../../../core/services/preferences.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ElectronService } from '../../../core/services/electron.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { getPossibleConfigFilenames } from '../../config-editor/services/config-parser.service';

@Component({
  selector: 'app-package-table',
  templateUrl: './package-table.component.html',
  styleUrls: ['./package-table.component.scss']
})
export class PackageTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() formGroup: FormGroup;
  @Input() applyChanges: (changes: PackageChangeset) => void;

  dataSource: PackageTableDataSource;
  isLoading: boolean;

  installedPackages: Observable<PackageList>;

  private availableColumns = [
    'select',
    'installed',
    'icon',
    'id',
    'name',
    'author',
    'updated',
    'latest',
    'downloads'
  ];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'select',
    'installed',
    'icon',
    'name',
    'author',
    'updated',
    'latest',
    'downloads'
  ];
  selection: SelectionModel<SelectablePackge>;

  filter = new FormControl('');

  shouldHumanize = this.prefs.get('humanizePackageNames');

  private subscription = new Subscription();

  private changes = new PackageChangeset();

  constructor(
    public packages: PackageService,
    private prefs: PreferencesService,
    private electron: ElectronService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.selection = this.packages.selection;
    this.installedPackages = this.packages.installedPackages$;

    // this.subscription.add(1)
    this.refreshPackages = this.refreshPackages.bind(this);
    this.electron.ipcRenderer.on('refreshPackages', this.refreshPackages);
    this.subscription.add(() => {
      this.electron.ipcRenderer.removeListener(
        'refreshPackages',
        this.refreshPackages
      );
    });

    this.subscription.add(
      this.prefs.onChange('humanizePackageNames').subscribe(shouldHumanize => {
        console.log('New humanize', shouldHumanize.newValue);
        this.shouldHumanize = shouldHumanize.newValue;
      })
    );

    // update selected status for datasource sorting feature
    this.subscription.add(
      this.selection.changed.pipe(delay(0)).subscribe(changed => {
        changed.added.forEach(pkg => {
          pkg.selected = true;
          pkg.dirty = calcPackageDirty(pkg);
          this.selectAllDependencies(pkg.latestVersion);
          if (this.changes.removed.has(pkg)) {
            this.changes.removed.delete(pkg);
          } else if (pkg.dirty) {
            this.changes.updated.add(pkg.latestVersion);
          }
        });
        changed.removed.forEach(pkg => {
          pkg.selected = false;
          pkg.dirty = calcPackageDirty(pkg);
          this.deselectAvailDependencies(pkg.latestVersion);
          if (this.changes.updated.has(pkg.latestVersion)) {
            this.changes.updated.delete(pkg.latestVersion);
          } else if (pkg.dirty) {
            this.changes.removed.add(pkg);
          }
        });

        this.packages.pendingChanges.next(this.changes);
        this.formGroup.patchValue(this.changes);
        if (this.changes.updated.size > 0 || this.changes.removed.size > 0) {
          this.formGroup.markAsDirty();
        }
      })
    );

    this.subscription.add(
      this.installedPackages.subscribe(pkgs => {
        console.log('Selecting installed packages', pkgs);
        this.changes = new PackageChangeset();
        this.selection.select(...pkgs);
        if (this.dataSource && this.dataSource.hasData())
          this.dataSource.data.forEach(pkg => {
            pkg.dirty = calcPackageDirty(pkg);
          });
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
        this.packages,
        this.prefs
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
    this.packages.selectedPackage.next(pkg);
    // this.showPackageDetails.emit(pkg);
  }

  showContextMenu(pkg: Package) {
    if (pkg.installedVersion) {
      this.electron.remote.Menu.buildFromTemplate([
        {
          label: 'Open config file (external)',
          click: this.tryOpenPackageConfig.bind(this)(pkg)
        },
        {
          label: 'Edit config file (internal)',
          click: this.tryEditConfig.bind(this)(pkg)
        }
      ]).popup();
    }
  }

  tryOpenPackageConfig(pkg: Package) {
    const join = this.electron.path.join;
    const filenames = getPossibleConfigFilenames(pkg);

    return async () => {
      const dir = join(this.prefs.get('ror2_path'), 'BepInEx', 'config');
      let foundConfigFile: string;
      for (const fileName of filenames) {
        const testPath = join(dir, fileName);
        if (await this.electron.fs.pathExists(testPath)) {
          foundConfigFile = testPath;
          break;
        }
      }

      if (foundConfigFile !== undefined) {
        this.electron.remote.shell.openItem(foundConfigFile);
      } else {
        this.electron.remote.dialog.showErrorBox(
          'File not found',
          `Could not find config file for ${pkg.name}`
        );
      }
    };
  }

  tryEditConfig(pkg: Package) {
    const join = this.electron.path.join;
    const filenames = getPossibleConfigFilenames(pkg);

    return async () => {
      const dir = join(this.prefs.get('ror2_path'), 'BepInEx', 'config');

      for (const file of filenames) {
        const testPath = join(dir, file);
        if (await this.electron.fs.pathExists(testPath)) {
          this.ngZone.run(() => {
            this.router.navigate(['/config-editor/' + file]);
          });
          return;
        }
      }

      this.electron.remote.dialog.showErrorBox(
        'File not found',
        `Could not find config file for ${pkg.name}`
      );
    };
  }

  handleApplyChanges() {
    // const added = new Set<Package>();
    // const removed = new Set<Package>();
    // this.dataSource.data.forEach(pkg => {
    //   if (pkg.dirty) {
    //     if (pkg.selected) {
    //       added.add(pkg);
    //     } else {
    //       removed.add(pkg);
    //     }
    //   }
    // });

    // const changes = new PackageChangeset();
    // changes.removed = removed;
    // changes.updated = new Set(Array.from(added).map(pkg => pkg.latestVersion));
    // this.formGroup.patchValue(changes);
    // this.formGroup.markAsDirty();
    // this.packages.pendingChanges.next(changes);

    if (this.applyChanges) this.applyChanges(this.changes);
    // this.packages.applyChanges(changes);
  }

  refreshPackages() {
    this.packages.downloadPackageList();
  }

  isSelectionDirty = () => {
    if (!this.dataSource) return false;
    return this.dataSource.filteredData.some(pkg => pkg.dirty);
  };

  showColumnSelectMenu = () => {
    const activeColumns = new Set(this.displayedColumns);
    this.electron.remote.Menu.buildFromTemplate(
      this.availableColumns.map<Electron.MenuItemConstructorOptions>(col => ({
        label: col[0].toUpperCase() + col.slice(1),
        type: 'checkbox',
        checked: activeColumns.has(col),
        click: () => {
          if (activeColumns.has(col)) activeColumns.delete(col);
          else activeColumns.add(col);
          this.displayedColumns = this.availableColumns.filter(c =>
            activeColumns.has(c)
          );
          this.changeDetector.detectChanges();
        }
      }))
    ).popup();
  };

  columnDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  private selectAllDependencies(pkg: PackageVersion) {
    const toSelect: PackageVersionList = [];
    pkg.dependencies.forEach(dep => {
      dep.pkg.requiredBy.add(pkg);

      toSelect.push(dep);
    });

    if (toSelect.length) this.selection.select(...toSelect.map(p => p.pkg));
  }

  private deselectAvailDependencies(pkg: PackageVersion) {
    const toDeselct: PackageVersionList = [];

    pkg.dependencies.forEach(dep => {
      const { requiredBy } = dep.pkg;

      requiredBy.delete(pkg);
      if (requiredBy.size === 0) {
        toDeselct.push(dep);
      }
    });

    if (toDeselct.length) this.selection.deselect(...toDeselct.map(p => p.pkg));
  }
}
