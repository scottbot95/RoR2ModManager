import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOneComponent } from './step-one.component';
import { MaterialModule } from '../../../../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { PackageService } from '../../../../core/services/package.service';
import { MockPackageService } from '../../../../core/services/mocks.spec';

@Component({
  selector: 'app-package-table',
  template: '<p>mock package table</p>'
})
class MockPackageTableComponent {
  @Input() applyChanges: Function;
}

@Component({
  selector: 'app-package-details',
  template: '<p>mock package details</p>'
})
class MockPackageDetailsComponent {}

describe('StepOneComponent', () => {
  let component: StepOneComponent;
  let fixture: ComponentFixture<StepOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StepOneComponent,
        MockPackageTableComponent,
        MockPackageDetailsComponent
      ],
      imports: [MaterialModule, ReactiveFormsModule],
      providers: [{ provide: PackageService, useClass: MockPackageService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
