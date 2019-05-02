import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavMenuComponent } from './nav-menu.component';
import { MaterialModule } from '../../../shared/material.module';
import { MatToolbarModule, MatSidenavModule } from '@angular/material';
import { ThemeService } from '../../../core/services/theme.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockThemeService } from '../../../core/services/mocks.spec';

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavMenuComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MaterialModule,
        RouterTestingModule,
        MatToolbarModule,
        MatSidenavModule
      ],
      providers: [{ provide: ThemeService, useClass: MockThemeService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
