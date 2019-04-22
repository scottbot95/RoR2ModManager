import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesPageComponent } from './packages-page.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-package-table',
  template: '<p>Mock Package Table Component</p>'
})
class MockPackageTableComponent {}

describe('PackagesPageComponent', () => {
  let component: PackagesPageComponent;
  let fixture: ComponentFixture<PackagesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PackagesPageComponent, MockPackageTableComponent]
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
