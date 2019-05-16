import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { MatStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ProfileService } from '../../../profile/services/profile.service';

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

  constructor(
    private profile: ProfileService,
    private changeDetector: ChangeDetectorRef
  ) {}

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

    this.subscription.add(
      this.profile.confirmProfile.subscribe(() => {
        this.stepper.selectedIndex = 1;
        this.changeDetector.detectChanges();
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

  reset = () => {
    this.stepper.reset();
  };
}
