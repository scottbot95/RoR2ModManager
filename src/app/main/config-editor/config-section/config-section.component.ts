import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter
} from '@angular/core';
import { ConfigMap, ConfigMapValue } from '../services/config-parser.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-config-section',
  templateUrl: './config-section.component.html',
  styleUrls: ['./config-section.component.scss']
})
export class ConfigSectionComponent implements OnInit, OnChanges {
  @Input() section: ConfigMapValue;
  @Input() expanded: boolean;

  @Output() changed: EventEmitter<boolean> = new EventEmitter();

  @ViewChildren('sectionEditor') childSections: QueryList<
    ConfigSectionComponent
  >;

  sectionKeys: ConfigMapValue[];
  subSections: ConfigMap;

  form: FormGroup = this.fb.group({});

  isOpen: { [key: string]: boolean } = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    for (const field of this.sectionKeys) {
      this.form.addControl(field.name, this.fb.control(field.value));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['section'];
    if (!change) return;
    const newSection = change.currentValue as ConfigMapValue;
    if (newSection.type !== 'object')
      throw new Error(
        `section must be an objet type. ${newSection.type} provided`
      );

    this.sectionKeys = [];
    this.subSections = {};

    for (const key of Object.keys(newSection.value)) {
      const value = (newSection.value as ConfigMap)[key];

      if (value.type !== 'object') this.sectionKeys.push(value);
      else this.subSections[key] = value;
    }

    console.log(this.subSections);
  }

  isDirty(): boolean {
    return this.form.dirty || this.childSections.some(sec => sec.form.dirty);
  }

  getValues(): ConfigMap {
    const values: ConfigMap = {};
    for (const field of this.sectionKeys) {
      values[field.name] = {
        description: field.description,
        name: field.name,
        type: field.type,
        value: this.form.get(field.name).value
      };
    }

    this.childSections.reduce((acc, sec) => {
      acc[sec.section.name] = {
        name: sec.section.name,
        type: 'object',
        description: sec.section.description,
        value: sec.getValues()
      };
      return acc;
    }, values);

    return values;
  }

  reset() {
    const pristineValues = {};
    for (const field of this.sectionKeys) {
      pristineValues[field.name] = field.value;
    }

    this.form.reset(pristineValues);

    this.childSections.forEach(sec => sec.reset());
  }
}
