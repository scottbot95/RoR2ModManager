import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSectionComponent } from './config-section.component';
import { MaterialModule } from '../../../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HumanizePipe } from '../../../shared/humanize.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { ConfigMapValue } from '../services/config-parser.service';
import { By } from '@angular/platform-browser';

@Component({
  template: '<app-config-section [section]="section"></app-config-section>'
})
class TestHostComponent {
  section: ConfigMapValue = { type: 'object', name: 'TestSection', value: {} };
}

describe('ConfigSectionComponent', () => {
  let component: ConfigSectionComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, ConfigSectionComponent, HumanizePipe],
      imports: [MaterialModule, ReactiveFormsModule, NoopAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.debugElement.query(By.directive(ConfigSectionComponent))
      .componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
