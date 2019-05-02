import { Component, OnInit } from '@angular/core';
import { ElectronService } from './core/services/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ThemeService } from './core/services/theme.service';
import { Observable } from 'rxjs';
import { ProfileService } from './profile/services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  themeClass$: Observable<string>;

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private theme: ThemeService,
    private profile: ProfileService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    console.log('AppConfig', AppConfig);

    this.profile.registerMenuHandlers();

    if (this.electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    this.themeClass$ = this.theme.themeClass$;
  }
}
