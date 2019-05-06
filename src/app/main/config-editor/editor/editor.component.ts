import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigParserService,
  ConfigMap,
  ConfigMapValue
} from '../services/config-parser.service';
import { ConfigSectionComponent } from '../config-section/config-section.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  parsedConfig: ConfigMap;
  sections: ConfigMapValue[] = [];
  filename: string;

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
    this.sections = Object.keys(this.parsedConfig).map(
      key => this.parsedConfig[key]
    );
  }

  someSectionDirty() {
    if (this.sectionEditors) {
      return this.sectionEditors.some(sec => sec.isDirty());
    }
  }

  reset() {
    this.sectionEditors.forEach(sec => sec.reset());
  }

  saveChanges() {
    const sectionValues: ConfigMap = this.sectionEditors.reduce((acc, sec) => {
      acc[sec.section.name] = sec.getValues();
      return acc;
    }, {});

    console.log(sectionValues);
  }
}
