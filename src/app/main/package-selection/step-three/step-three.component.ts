import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit {
  formStep3: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formStep3 = this.fb.group({});
  }
}
