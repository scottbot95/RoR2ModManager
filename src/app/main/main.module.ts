import { NgModule } from '@angular/core';

import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PreferencesPageComponent } from './preferences-page/preferences-page.component';
import { MainComponent } from './main/main.component';
import { NavMenuModule } from './nav-menu/nav-menu.module';
import { PackageSelectionModule } from './package-selection/package-selection.module';

@NgModule({
  declarations: [PreferencesPageComponent, MainComponent],
  imports: [
    SharedModule,
    MainRoutingModule,
    NavMenuModule,
    PackageSelectionModule
  ]
})
export class MainModule {}
