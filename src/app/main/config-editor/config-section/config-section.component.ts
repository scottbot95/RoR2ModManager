import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ConfigMap, ConfigMapValue } from '../services/config-parser.service';
import { MatSlideToggle } from '@angular/material';

@Component({
  selector: 'app-config-section',
  templateUrl: './config-section.component.html',
  styleUrls: ['./config-section.component.scss']
})
export class ConfigSectionComponent implements OnInit, OnChanges {
  @Input() section: ConfigMapValue;

  sectionKeys: ConfigMapValue[];
  subSections: ConfigMapValue[];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['section'];
    const newSection = change.currentValue as ConfigMapValue;
    if (newSection.type !== 'object')
      throw new Error('section must be an objet type');

    this.sectionKeys = [];
    this.subSections = [];
    for (const key of Object.keys(newSection.value)) {
      const value = (newSection.value as ConfigMap)[key];

      if (value.type !== 'object') this.sectionKeys.push(value);
      else this.subSections.push(value);
    }
  }

  isDirty(input: MatSlideToggle, field: ConfigMapValue) {
    return input.checked !== field.value;
  }
}
