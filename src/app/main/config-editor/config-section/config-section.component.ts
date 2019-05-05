import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ConfigMap } from '../services/config-parser.service';

@Component({
  selector: 'app-config-section',
  templateUrl: './config-section.component.html',
  styleUrls: ['./config-section.component.scss']
})
export class ConfigSectionComponent implements OnInit, OnChanges {
  @Input() section: ConfigMap;

  sectionKeys: {
    type: string;
    label: string;
    value: any;
    description?: string;
  }[];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['section'];
    const newSection = change.currentValue as ConfigMap;

    this.sectionKeys = [];
    for (const key of Object.keys(newSection)) {
      const value = newSection[key];
      this.sectionKeys.push({ label: key, type: typeof value, value });
    }

    console.log(this.sectionKeys);
  }
}
