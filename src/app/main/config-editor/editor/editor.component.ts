import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigParserService,
  ConfigMap
} from '../services/config-parser.service';
import { ConfigSectionComponent } from '../config-section/config-section.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  parsedConfig: ConfigMap;
  filename: string;

  isOpen: { [key: string]: boolean } = {};

  goBack = window.history.back;

  @ViewChildren('editorSection') sectionEditors: QueryList<
    ConfigSectionComponent
  >;

  constructor(
    private route: ActivatedRoute,
    private parser: ConfigParserService
  ) {}

  async ngOnInit() {
    this.filename = this.route.snapshot.paramMap.get('file');
    this.parsedConfig = await this.parser.parseFile(this.filename);
    console.log(this.parsedConfig);
  }

  someSectionDirty() {
    if (this.sectionEditors) {
      return this.sectionEditors.some(sec => sec.isDirty());
    }
  }

  reset() {
    this.sectionEditors.forEach(sec => sec.reset());
  }

  async saveChanges() {
    const sectionValues: ConfigMap = this.sectionEditors.reduce(
      (acc, sec) => {
        acc[sec.section.name] = {
          name: sec.section.name,
          type: 'object',
          value: sec.getValues()
        };
        return acc;
      },
      <ConfigMap>{}
    );

    // this.parser.serializeConfigMap(sectionValues);
    await this.parser.writeConfigMap(sectionValues, this.filename);

    this.parsedConfig = sectionValues;
    // Object.assign(this.parsedConfig, sectionValues);
    this.reset();
  }
}
