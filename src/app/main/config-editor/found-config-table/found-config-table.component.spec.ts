import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundConfigTableComponent } from './found-config-table.component';

describe('FoundConfigTableComponent', () => {
  let component: FoundConfigTableComponent;
  let fixture: ComponentFixture<FoundConfigTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoundConfigTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundConfigTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
