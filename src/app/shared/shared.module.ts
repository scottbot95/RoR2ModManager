import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FocusOnKeysDirective } from './focus-on-keys.directive';

@NgModule({
  declarations: [FocusOnKeysDirective],
  exports: [CommonModule, MaterialModule, FlexLayoutModule, ReactiveFormsModule, FocusOnKeysDirective]
})
export class SharedModule {}
