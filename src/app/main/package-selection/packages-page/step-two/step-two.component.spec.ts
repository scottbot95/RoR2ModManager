import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoComponent } from './step-two.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';
import { PackageService } from '../../../../core/services/package.service';
import { MockPackageService } from '../../../../core/services/mocks.spec';

@Component({
  selector: 'app-changes-table',
  template: '<p>Mock changes table</p>'
})
class MockChangesTableComponent {}

describe('StepTwoComponent', () => {
  let component: StepTwoComponent;
  let fixture: ComponentFixture<StepTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepTwoComponent, MockChangesTableComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [{ provide: PackageService, useClass: MockPackageService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
