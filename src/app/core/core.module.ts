import { NgModule } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { ThemeService } from './services/theme.service';
import { ThunderstoreService } from './services/thunderstore.service';
import { PackageService } from './services/package.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    ElectronService,
    ThemeService,
    ThunderstoreService,
    PackageService
  ]
})
export class CoreModule {}
