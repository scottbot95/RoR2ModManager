import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThemeService } from '../../../core/services/theme.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { version } from '../../../../../package.json';
import { AppConfig } from '../../../../environments/environment';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(map(result => result.matches));

  version: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public theme: ThemeService,
    private location: Location,
    public router: Router
  ) {}

  ngOnInit() {
    this.version = AppConfig.production
      ? version
      : `${version}-${AppConfig.environment}`;
    console.log(window.location);
  }

  goBack() {
    this.location.back();
  }
}
