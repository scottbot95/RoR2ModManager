import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import { ProfileService } from '../../profile/services/profile.service';
import { ElectronService } from '../../core/services/electron.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-profile-dialog',
  templateUrl: './new-profile-dialog.component.html',
  styleUrls: ['./new-profile-dialog.component.scss']
})
export class NewProfileDialogComponent implements OnInit {
  @ViewChild('profileForm') formElem: FormGroupDirective;
  form: FormGroup;

  profiles: Observable<string[]>;

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

    this.profiles = this.profileService.profileNames$;
  }

  createProfile() {
    if (this.form.invalid) return;
    const win = this.electron.remote.getCurrentWindow();
    const parent = win.getParentWindow();
    parent.webContents.send('createProfile', this.form.value);
    parent.focus();
    win.close();
  }

  getTooltip() {
    return `Create ${this.form.get('name').value || 'Profile'}`;
  }
}
