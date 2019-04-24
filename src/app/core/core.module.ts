import { NgModule } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { ThemeService } from './services/theme.service';
import { ThunderstoreService } from './services/thunderstore.service';
import { PreferencesService } from './services/preferences.service';
import { PackageService } from './services/package.service';
import { DownloadService } from './services/download.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    ElectronService,
    ThemeService,
    ThunderstoreService,
    PreferencesService,
    PackageService,
    DownloadService
  ]
})
export class CoreModule {}
