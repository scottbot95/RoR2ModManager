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
  MatExpansionModule,
  MatProgressBarModule
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
    MatProgressBarModule,
    MatCardModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule
  ]
})
export class MaterialModule {}
