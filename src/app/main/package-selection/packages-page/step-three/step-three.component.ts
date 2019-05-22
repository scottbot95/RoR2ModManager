import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PackageService } from '../../../services/package.service';
import { Subscription } from 'rxjs';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit, OnChanges, OnDestroy {
  @Output() done = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  @Input() visible: boolean;

  formStep3: FormGroup;

  working = false;
  complete = false;

  logs: string[];

  progress: number;

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private packages: PackageService,
    private scrollToService: ScrollToService
  ) {}

  ngOnInit() {
    this.formStep3 = this.fb.group({});

    let logSub: Subscription;
    this.subscription.add(
      this.packages.log$.subscribe(log => {
        if (logSub) logSub.unsubscribe();
        this.logs = [];
        logSub = log.subscribe(row => {
          this.logs.push(row);
          this.scrollToService.scrollTo({ target: 'bottom', duration: 250 });
        });
      })
    );

    this.subscription.add(
      this.packages.applyPercentage$.subscribe(progress => {
        this.progress = progress * 100;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['visible'];
    if (!change || change.previousValue === change.currentValue) return;
    if (change.currentValue) setTimeout(this.applyChanges.bind(this));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async applyChanges() {
    console.log('Applying changes');
    this.working = true;
    this.complete = false;
    try {
      await this.packages.applyChanges();
    } catch (err) {
      const name = err.name || 'Error';
      this.formStep3.setErrors({ [name]: err.message || err });
    }
    this.done.emit();
    this.working = false;
    this.complete = true;
  }

  back() {
    this.reset.emit();
    this.packages.clearLog();
  }
}
