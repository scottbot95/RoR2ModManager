import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SharedModule } from '../../shared/shared.module';
import { PackageTableComponent } from './package-table/package-table.component';
import { PackagesPageComponent } from './packages-page/packages-page.component';
import {
  MatSortModule,
  MatPaginatorModule,
  MatTableModule,
  MatStepperModule
} from '@angular/material';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { MarkdownModule } from 'ngx-markdown';
import { StepTwoComponent } from './packages-page/step-two/step-two.component';
import { StepOneComponent } from './packages-page/step-one/step-one.component';
import { StepThreeComponent } from './packages-page/step-three/step-three.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@NgModule({
  declarations: [
    PackageTableComponent,
    PackagesPageComponent,
    PackageDetailsComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent
  ],
  imports: [
    SharedModule,
    MarkdownModule.forChild(),
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatStepperModule,
    DragDropModule
  ]
})
export class PackageSelectionModule {}
