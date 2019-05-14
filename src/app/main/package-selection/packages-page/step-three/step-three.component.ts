import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { PackageService } from '../../../../core/services/package.service';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit, OnChanges {
  @Output() done = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  @Input() visible: boolean;

  formStep3: FormGroup;

  working = false;

  constructor(private fb: FormBuilder, private packages: PackageService) {}

  ngOnInit() {
    this.formStep3 = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['visible'];
    if (!change || change.previousValue === change.currentValue) return;
    if (change.currentValue) setTimeout(this.applyChanges.bind(this));
  }

  async applyChanges() {
    console.log('Applying changes');
    this.working = true;
    setTimeout(() => {
      this.done.emit();
      this.working = false;
    }, 2000);
    // await this.packages.applyChanges();
    // this.done.emit();
  }
}
