import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { PreferencesService } from '../../../core/services/preferences.service';
import { ElectronService } from '../../../core/services/electron.service';
import { Package } from '../../../core/models/package.model';

interface ConfigFile {
  pkg?: Package;
  filename: string;
}

@Component({
  selector: 'app-found-config-table',
  templateUrl: './found-config-table.component.html',
  styleUrls: ['./found-config-table.component.scss']
})
export class FoundConfigTableComponent implements OnInit {
  configFiles: ConfigFile[] = [];

  constructor(
    private prefs: PreferencesService,
    private electron: ElectronService,
    private changeDetector: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    const matches = await this.electron.glob(
      `${this.prefs.get('ror2_path')}/BepInEx/config/*.cfg`
    );
    this.configFiles = matches.map(file => ({
      filename: this.electron.path.basename(file)
    }));
    this.ngZone.run(() => this.changeDetector.detectChanges());
  }
}
