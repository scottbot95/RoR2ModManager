import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import {
  PackageChangeset,
  PackageService
} from '../../../core/services/package.service';

const packageChangesValidator = (group: FormGroup): ValidationErrors => {
  const changes: PackageChangeset = group.value;
  const totalChanges = changes.updated.size + changes.removed.size;
  return totalChanges === 0
    ? { packageChanges: 'Changes must be selected to apply them' }
    : null;
};

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {
  public formStep1: FormGroup;
  public selectedPackage = this.packages.selectedPackage;

  @ViewChild('nextButton') nextButton: ElementRef;

  constructor(private fb: FormBuilder, private packages: PackageService) {}

  ngOnInit() {
    this.formStep1 = this.fb.group(new PackageChangeset(), {
      validators: [packageChangesValidator]
    });
  }

  nextPage = () => {
    if (this.nextButton.nativeElement.click)
      this.nextButton.nativeElement.click();
  };
}
