import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { Package } from '../../core/models/package.model';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageDetailsComponent implements OnInit {
  @Input() package: Package;

  constructor() {}

  ngOnInit() {}
}
