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
import { ElectronService } from '../../../core/services/electron.service';

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
    private electron: ElectronService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
        this.animating = true;
        this.currentStep = event.selectedIndex;
        if (event.selectedIndex === 0 && event.previouslySelectedIndex === 1) {
          this.electron.showMessageBox(
            {
              title: 'Cancel Pending Switch?',
              message:
                `Do you want to cancel the pending change to profile` +
                `'${this.profile.pendingProfileName}'?`,
              buttons: ['Yes', 'No'],
              type: 'question'
            },
            clickedIndex => {
              if (clickedIndex === 0) {
                this.canceled();
              }
            }
          );
        } else if (event.selectedIndex === 2) {
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
        if (this.stepper.selectedIndex === 0) {
          this.profile.confirmPendingSwitch();
        }
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

  canceled() {
    this.profile.cancelPendingSwitch();
  }
}
