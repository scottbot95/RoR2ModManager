import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ElectronService } from './core/services/electron.service';
import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import {
  MockThemeService,
  MockElectronService,
  MockProfileService
} from './core/services/mocks';
import { ProfileService } from './profile/services/profile.service';

@Component({
  selector: 'app-nav-menu',
  template: '<p>Mock Nav Menu component</p>'
})
class MockNavMenuComponent {}

class TranslateServiceStub {
  setDefaultLang(lang: string): void {}
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, MockNavMenuComponent],
      providers: [
        { provide: ElectronService, useClass: MockElectronService },
        { provide: ThemeService, useClass: MockThemeService },
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: ProfileService, useClass: MockProfileService }
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));
});
