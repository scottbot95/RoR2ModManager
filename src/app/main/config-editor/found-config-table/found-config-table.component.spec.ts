import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundConfigTableComponent } from './found-config-table.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../shared/material.module';
import { PreferencesService } from '../../../core/services/preferences.service';
import {
  MockPreferencesService,
  MockElectronService
} from '../../../core/services/mocks.spec';
import { ElectronService } from '../../../core/services/electron.service';

describe('FoundConfigTableComponent', () => {
  let component: FoundConfigTableComponent;
  let fixture: ComponentFixture<FoundConfigTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FoundConfigTableComponent],
      imports: [RouterTestingModule, MaterialModule],
      providers: [
        { provide: PreferencesService, useClass: MockPreferencesService },
        { provide: ElectronService, useClass: MockElectronService }
      ]
    }).compileComponents();
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
