import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatGridListModule,
  MatSlideToggleModule,
  MatFormFieldModule,
  MatInputModule,
  MatExpansionModule
} from '@angular/material';

// Inject hammerjs
import 'hammerjs';

@NgModule({
  exports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule
  ]
})
export class MaterialModule {}
