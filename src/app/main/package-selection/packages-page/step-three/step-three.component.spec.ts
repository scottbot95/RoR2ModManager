import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThreeComponent } from './step-three.component';
import { MaterialModule } from '../../../../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PackageService } from '../../../../core/services/package.service';
import { MockPackageService } from '../../../../core/services/mocks.spec';

describe('StepThreeComponent', () => {
  let component: StepThreeComponent;
  let fixture: ComponentFixture<StepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepThreeComponent],
      imports: [MaterialModule, ReactiveFormsModule],
      providers: [{ provide: PackageService, useClass: MockPackageService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
