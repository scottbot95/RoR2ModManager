import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackagesPageComponent } from './packages-page/packages-page.component';

const routes: Routes = [
  {
    path: 'packages',
    component: PackagesPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesRoutingModule {}
