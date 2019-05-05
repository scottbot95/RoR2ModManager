import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PreferencesService } from '../../../core/services/preferences.service';
import { ElectronService } from '../../../core/services/electron.service';

import { parse as parseToml } from 'toml';
import { ConfigParserService } from '../services/config-parser.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  parsedConfig: any;

  constructor(
    private route: ActivatedRoute,
    private parser: ConfigParserService
  ) {}

  async ngOnInit() {
    const filename = this.route.snapshot.paramMap.get('file');
    this.parsedConfig = await this.parser.parseFile(filename);
    console.log(this.parsedConfig);
  }
}
