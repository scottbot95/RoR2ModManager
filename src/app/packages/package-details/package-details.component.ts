import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
