import { NgModule } from '@angular/core';

import { PackagesRoutingModule } from './packages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PackageTableComponent } from './package-table/package-table.component';
import { PackagesPageComponent } from './packages-page/packages-page.component';
import {
  MatSortModule,
  MatPaginatorModule,
  MatTableModule
} from '@angular/material';

@NgModule({
  declarations: [PackageTableComponent, PackagesPageComponent],
  imports: [
    PackagesRoutingModule,
    SharedModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule
  ]
})
export class PackagesModule {}
