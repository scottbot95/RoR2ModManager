import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreferencesPageComponent } from './preferences-page/preferences-page.component';
import { MainComponent } from './main/main.component';
import { PackagesPageComponent } from './package-selection/packages-page/packages-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'packages'
      },
      {
        path: 'packages',
        pathMatch: 'full',
        component: PackagesPageComponent
      },
      {
        path: 'preferences',
        pathMatch: 'full',
        component: PreferencesPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
