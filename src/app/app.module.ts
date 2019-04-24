import 'reflect-metadata';
import '../polyfills';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { NavMenuModule } from './nav-menu/nav-menu.module';
import { PackagesModule } from './packages/packages.module';
import { SharedModule } from './shared/shared.module';
import { PreferencesPageComponent } from './preferences-page/preferences-page.component';
import { ReactiveFormsModule } from '@angular/forms';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, PreferencesPageComponent],
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    NavMenuModule,
    PackagesModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
