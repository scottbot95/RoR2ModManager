import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesPageComponent } from './packages-page.component';
import { PackageService } from '../../../core/services/package.service';
import {
  MockPackageService,
  MockProfileService
} from '../../../core/services/mocks.spec';
import { MaterialModule } from '../../../shared/material.module';
import { MatStepperModule } from '@angular/material';
import { Component, Input } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileService } from '../../../profile/services/profile.service';

@Component({
  selector: 'app-step-one',
  template: '<p>Mock Step One</p>'
})
class MockStepOneComponent {}

@Component({
  selector: 'app-step-two',
  template: '<p>Mock Step Two</p>'
})
class MockStepTwoComponent {}

@Component({
  selector: 'app-step-three',
  template: '<p>Mock Step Three</p>'
})
class MockStepThreeComponent {
  @Input() visible: boolean;
}

describe('PackagesPageComponent', () => {
  let component: PackagesPageComponent;
  let fixture: ComponentFixture<PackagesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PackagesPageComponent,
        MockStepOneComponent,
        MockStepTwoComponent,
        MockStepThreeComponent
      ],
      imports: [MaterialModule, MatStepperModule, NoopAnimationsModule],
      providers: [
        { provide: PackageService, useClass: MockPackageService },
        { provide: ProfileService, useClass: MockProfileService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
