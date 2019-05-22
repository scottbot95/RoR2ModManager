import { NgModule } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { ThemeService } from './services/theme.service';
import { ThunderstoreService } from './services/thunderstore.service';
import { PreferencesService } from './services/preferences.service';
import { DownloadService } from './services/download.service';
import { DatabaseService } from './services/database.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    ElectronService,
    ThemeService,
    ThunderstoreService,
    PreferencesService,
    DownloadService,
    DatabaseService
  ]
})
export class CoreModule {}
