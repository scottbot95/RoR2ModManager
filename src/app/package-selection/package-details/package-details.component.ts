import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
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
  @Output() showPackageDetails = new EventEmitter<Package>();

  constructor() {}

  ngOnInit() {}

  showDetails(pkg: Package) {
    this.showPackageDetails.emit(pkg);
  }
}
