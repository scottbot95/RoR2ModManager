import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigParserService,
  ConfigMap,
  ConfigMapValue
} from '../services/config-parser.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  parsedConfig: ConfigMap;
  sections: ConfigMapValue[] = [];
  filename: string;

  constructor(
    private route: ActivatedRoute,
    private parser: ConfigParserService
  ) {}

  async ngOnInit() {
    this.filename = this.route.snapshot.paramMap.get('file');
    this.parsedConfig = await this.parser.parseFile(this.filename);
    this.sections = Object.keys(this.parsedConfig).map(
      key => this.parsedConfig[key]
    );

    console.log(this.sections);
  }
}
