import { Component, OnInit, OnDestroy } from '@angular/core';
import { PreferencesService } from '../core/services/preferences.service';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElectronService } from '../core/services/electron.service';

@Component({
  selector: 'app-preferences-page',
  templateUrl: './preferences-page.component.html',
  styleUrls: ['./preferences-page.component.scss']
})
export class PreferencesPageComponent implements OnInit, OnDestroy {
  constructor(
    private prefs: PreferencesService,
    private fb: FormBuilder,
    private electron: ElectronService
  ) {}

  darkMode = this.fb.control(this.prefs.get('darkMode'));
  ror2Path = this.prefs.get('ror2_path');

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

  selectRoR2Path() {
    const result = this.electron.remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (result) {
      console.log(result);
      const path = result[0];
      // TODO verify it's a valid RoR2 path
      this.prefs.set('ror2_path', path);
      this.ror2Path = path;
    }
  }
}
