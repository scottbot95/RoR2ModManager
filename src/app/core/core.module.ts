import { NgModule } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { ThemeService } from './services/theme.service';
import { ThunderstoreService } from './services/thunderstore.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [ElectronService, ThemeService, ThunderstoreService]
})
export class CoreModule {}
