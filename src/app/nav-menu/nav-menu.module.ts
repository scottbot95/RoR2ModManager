import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavMenuComponent],
  imports: [
    SharedModule,
    RouterModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule
  ],
  exports: [NavMenuComponent]
})
export class NavMenuModule {}
