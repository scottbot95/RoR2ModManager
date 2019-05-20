import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewProfileDialogComponent } from './new-profile-dialog/new-profile-dialog.component';

const routes: Routes = [
  { path: 'new-profile', component: NewProfileDialogComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DialogsRoutingModule {}
