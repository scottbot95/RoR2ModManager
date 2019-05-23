import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangesTableComponent } from './changes-table.component';
import { MaterialModule } from '../../../shared/material.module';
import { HumanizePipe } from '../../../shared/humanize.pipe';
import { PackageService } from '../../services/package.service';
import {
  MockPackageService,
  MockTranslatePipe
} from '../../../core/services/mocks.spec';
import { PreferencesService } from '../../../core/services/preferences.service';

describe('ChangesTableComponent', () => {
  let component: ChangesTableComponent;
  let fixture: ComponentFixture<ChangesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangesTableComponent, HumanizePipe, MockTranslatePipe],
      imports: [MaterialModule],
      providers: [
        { provide: PackageService, useClass: MockPackageService },
        { provide: PreferencesService, useClass: PreferencesService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
