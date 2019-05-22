import { NgModule } from '@angular/core';

import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PreferencesPageComponent } from './preferences-page/preferences-page.component';
import { MainComponent } from './main/main.component';
import { NavMenuModule } from './nav-menu/nav-menu.module';
import { PackageSelectionModule } from './package-selection/package-selection.module';
import { PackageService } from './services/package.service';
import { ProfileModule } from '../profile/profile.module';

@NgModule({
  declarations: [PreferencesPageComponent, MainComponent],
  imports: [
    SharedModule,
    MainRoutingModule,
    NavMenuModule,
    PackageSelectionModule,
    ProfileModule
  ],
  providers: [PackageService]
})
export class MainModule {}
