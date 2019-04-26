import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Package } from '../../core/models/package.model';
import { PreferencesService } from '../../core/services/preferences.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageDetailsComponent implements OnInit, OnDestroy {
  @Input() package: Package;
  @Output() showPackageDetails = new EventEmitter<Package>();

  shouldHumanize = this.prefs.get('humanizePackageNames');

  private subscription = new Subscription();

  constructor(private prefs: PreferencesService) {}

  ngOnInit() {
    this.subscription.add(
      this.prefs.onChange('humanizePackageNames').subscribe(event => {
        this.shouldHumanize = event.newValue;
      })
    );
  }

  showDetails(pkg: Package) {
    this.showPackageDetails.emit(pkg);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
