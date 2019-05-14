import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  PackageService,
  PackageChangeset
} from '../../../../core/services/package.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit, OnDestroy {
  public formStep2: FormGroup;
  public changes: PackageChangeset;

  private subscription = new Subscription();

  constructor(private fb: FormBuilder, private packages: PackageService) {}

  ngOnInit() {
    this.formStep2 = this.fb.group({
      confirmed: [false, Validators.requiredTrue]
    });

    this.subscription.add(
      this.packages.pendingChanges.subscribe({
        next: changes => {
          this.changes = changes;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
