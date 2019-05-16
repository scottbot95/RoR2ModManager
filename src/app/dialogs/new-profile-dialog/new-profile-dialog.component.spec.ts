import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProfileDialogComponent } from './new-profile-dialog.component';

describe('NewProfileDialogComponent', () => {
  let component: NewProfileDialogComponent;
  let fixture: ComponentFixture<NewProfileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProfileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
