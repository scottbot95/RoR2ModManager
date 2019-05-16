import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import { ProfileService } from '../../profile/services/profile.service';
import { ElectronService } from '../../core/services/electron.service';

@Component({
  selector: 'app-new-profile-dialog',
  templateUrl: './new-profile-dialog.component.html',
  styleUrls: ['./new-profile-dialog.component.scss']
})
export class NewProfileDialogComponent implements OnInit {
  @ViewChild('profileForm') formElem: FormGroupDirective;
  form: FormGroup;

  profiles: string[];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private electron: ElectronService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      copyFrom: ''
    });

    this.profiles = Array.from(this.profileService.profiles.keys());
  }

  buttonClick(event: Event) {
    console.log('submitting');

    this.formElem.onSubmit(new Event('submit'));
  }

  createProfile() {
    console.log('form submitted');
    if (this.form.invalid) return;
    const win = this.electron.remote.getCurrentWindow();
    win.getParentWindow().webContents.send('print', this.form.value);
    win.close();
  }

  getTooltip() {
    return `Create ${this.form.get('name').value || 'Profile'}`;
  }
}
