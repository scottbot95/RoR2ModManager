import { Component, OnInit, OnDestroy } from '@angular/core';
import { PreferencesService } from '../../core/services/preferences.service';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElectronService } from '../../core/services/electron.service';

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
  respectPinned = this.fb.control(this.prefs.get('respectPinned'));
  humanizePackageNames = this.fb.control(
    this.prefs.get('humanizePackageNames')
  );
  checkForPackageUpdates = this.fb.control(
    this.prefs.get('updatePackagesOnStart')
  );

  ror2Path = this.prefs.get('ror2_path');

  appUpdateCheckInterval = this.fb.control(
    this.prefs.get('appUpdateCheckInterval')
  );

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

    this.subscription.add(
      this.respectPinned.valueChanges.subscribe(newValue => {
        this.prefs.set('respectPinned', newValue);
      })
    );

    this.subscription.add(
      this.humanizePackageNames.valueChanges.subscribe(newValue => {
        this.prefs.set('humanizePackageNames', newValue);
      })
    );

    this.subscription.add(
      this.checkForPackageUpdates.valueChanges.subscribe(newValue => {
        this.prefs.set('updatePackagesOnStart', newValue);
      })
    );

    this.subscription.add(
      this.appUpdateCheckInterval.valueChanges.subscribe(newValue => {
        this.prefs.set('appUpdateCheckInterval', newValue);
        console.log(typeof newValue);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectRoR2Path() {
    this.electron.remote.dialog.showOpenDialog(
      this.electron.remote.getCurrentWindow(),
      {
        properties: ['openDirectory']
      },
      result => {
        if (result) {
          const path = result[0];
          const { join } = this.electron.path;
          this.electron.fs.access(join(path, 'Risk of Rain 2.exe'), err => {
            if (err) {
              this.electron.remote.dialog.showMessageBox(
                this.electron.remote.getCurrentWindow(),
                {
                  message: 'Directory must contain `Risk of Rain 2.exe',
                  title: 'Invalid Directory',
                  type: 'error',
                  buttons: ['Cancel', 'Retry'],
                  defaultId: 1,
                  cancelId: 0
                },
                response => {
                  if (response) {
                    this.selectRoR2Path();
                  }
                }
              );
            } else {
              this.prefs.set('ror2_path', path);
              this.ror2Path = path;
            }
          });
        }
      }
    );
  }
}
