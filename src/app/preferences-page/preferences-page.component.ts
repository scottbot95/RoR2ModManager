import { Component, OnInit, OnDestroy } from '@angular/core';
import { PreferencesService } from '../core/services/preferences.service';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-preferences-page',
  templateUrl: './preferences-page.component.html',
  styleUrls: ['./preferences-page.component.scss']
})
export class PreferencesPageComponent implements OnInit, OnDestroy {
  constructor(private prefs: PreferencesService, private fb: FormBuilder) {}

  darkMode = this.fb.control(this.prefs.get('darkMode'));

  private subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.prefs.onChange('darkMode').subscribe(({ newValue }) => {
        this.darkMode.setValue(newValue);
      })
    );

    this.subscription.add(
      this.darkMode.valueChanges.subscribe(newValue => {
        this.prefs.set('darkMode', newValue);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
