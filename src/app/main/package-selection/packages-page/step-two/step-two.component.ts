import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  PackageService,
  PackageChangeset
} from '../../../services/package.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit, OnDestroy {
  public formStep2: FormGroup;
  public changes: PackageChangeset;

  @Output() confirmed = new EventEmitter<boolean>();

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

    this.subscription.add(
      this.formStep2
        .get('confirmed')
        .valueChanges.subscribe(this.onConfirmChange)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onConfirmChange = (confirmed: boolean) => {
    this.confirmed.emit();
  };
}
