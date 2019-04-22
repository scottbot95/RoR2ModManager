import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  exports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule {}
