import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {
  public formStep2: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formStep2 = this.fb.group({});
  }
}
