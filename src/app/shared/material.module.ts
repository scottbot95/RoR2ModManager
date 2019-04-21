import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [MatButtonModule, MatIconModule, MatListModule, MatTooltipModule],
  exports: [MatButtonModule, MatIconModule, MatListModule, MatTooltipModule]
})
export class MaterialModule {}
