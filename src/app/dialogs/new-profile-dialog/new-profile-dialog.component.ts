import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import { ProfileService } from '../../profile/services/profile.service';
import { Observable } from 'rxjs';
import { DialogService } from '../services/dialog.service';

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
    private dialog: DialogService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      copyFrom: ''
    });

    this.profiles = this.profileService.profileNames$;

    this.dialog.dialogReady();
  }

  createProfile() {
    if (this.form.invalid) return;
    this.dialog.closeDialog(this.form.value);
  }

  getTooltip() {
    return `Create ${this.form.get('name').value || 'Profile'}`;
  }
}
