import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  exports: [MatButtonModule, MatIconModule, MatListModule, MatTooltipModule]
})
export class MaterialModule {}
