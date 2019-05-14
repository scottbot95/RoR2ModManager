import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
  PackageService,
  PackageChangeset
} from '../../../core/services/package.service';
import { Observable, Subscription } from 'rxjs';
import { PackageList, Package } from '../../../core/models/package.model';
import { map, tap } from 'rxjs/operators';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { MatStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-packages-page',
  templateUrl: './packages-page.component.html',
  styleUrls: ['./packages-page.component.scss'],
  host: {
    style: 'display:flex;flex-direction:column;flex-grow:1;'
  }
})
export class PackagesPageComponent implements OnInit, OnDestroy {
  @ViewChild(StepOneComponent) stepOneComponent: StepOneComponent;
  @ViewChild(StepTwoComponent) stepTwoComponent: StepTwoComponent;
  @ViewChild(StepThreeComponent) stepThreeComponent: StepThreeComponent;
  @ViewChild(MatStepper) stepper: MatStepper;

  editable = true;

  currentStep = 0;
  animating = true;

  private subscription = new Subscription();

  constructor() {}

  ngOnInit() {
    this.subscription.add(
      this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
        this.animating = true;
        this.currentStep = event.selectedIndex;
        if (this.currentStep === 2) {
          this.editable = false;
        }
      })
    );

    this.subscription.add(
      this.stepper.animationDone.subscribe(() => {
        this.animating = false;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

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
