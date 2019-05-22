import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FocusOnKeysDirective } from './focus-on-keys.directive';
import { HumanizePipe } from './humanize.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FocusOnKeysDirective, HumanizePipe],
  exports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FocusOnKeysDirective,
    HumanizePipe,
    TranslateModule
  ]
})
export class SharedModule {}
