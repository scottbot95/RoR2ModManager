import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PreferencesService } from '../../../core/services/preferences.service';
import { ElectronService } from '../../../core/services/electron.service';

import { parse as parseToml } from 'toml';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  parsedConfig: any;

  constructor(
    private route: ActivatedRoute,
    private prefs: PreferencesService,
    private electron: ElectronService
  ) {}

  async ngOnInit() {
    const filename = this.route.snapshot.paramMap.get('file');
    const confFile = this.electron.path.join(
      this.prefs.get('ror2_path'),
      'BepInEx',
      'config',
      filename
    );

    console.log('loading config file', confFile);

    const result = await this.electron.fs.readFile(confFile);
    try {
      this.parsedConfig = parseToml(
        result.toString('utf8').replace(/^\uFEFF/, '')
      );
    } catch (err) {
      console.error(
        `Syntax error on line ${err.line}:${err.column}.\n${err.message}`
      );
    }
    console.log(this.parsedConfig);
  }
}
