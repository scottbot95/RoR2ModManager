import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateModule } from '@ngx-translate/core';
import { ElectronService } from './core/services/electron.service';
import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { MockThemeService } from './shared/helpers';

@Component({
  selector: 'app-nav-menu',
  template: '<p>Mock Nav Menu component</p>'
})
class MockNavMenuComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, MockNavMenuComponent],
      providers: [
        ElectronService,
        { provide: ThemeService, useClass: MockThemeService }
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

class TranslateServiceStub {
  setDefaultLang(lang: string): void {}
}
