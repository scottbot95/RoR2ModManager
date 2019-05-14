import { Component, OnInit, ViewChild } from '@angular/core';
import {
  PackageService,
  PackageChangeset
} from '../../../core/services/package.service';
import { Observable } from 'rxjs';
import { PackageList, Package } from '../../../core/models/package.model';
import { map, tap } from 'rxjs/operators';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';

@Component({
  selector: 'app-packages-page',
  templateUrl: './packages-page.component.html',
  styleUrls: ['./packages-page.component.scss'],
  host: {
    style: 'display:flex;flex-direction:column;flex-grow:1;'
  }
})
export class PackagesPageComponent {
  @ViewChild(StepOneComponent) stepOneComponent: StepOneComponent;
  @ViewChild(StepTwoComponent) stepTwoComponent: StepTwoComponent;
  @ViewChild(StepThreeComponent) stepThreeComponent: StepThreeComponent;

  constructor() {}

  get formStepOne() {
    return this.stepOneComponent ? this.stepOneComponent.formStep1 : null;
  }

  get formStepTwo() {
    return this.stepTwoComponent ? this.stepTwoComponent.formStep2 : null;
  }

  get formStepThree() {
    return this.stepThreeComponent ? this.stepThreeComponent.formStep3 : null;
  }
}
