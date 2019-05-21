import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewProfileDialogComponent } from './new-profile-dialog/new-profile-dialog.component';
import { RenameProfileDialogComponent } from './rename-profile-dialog/rename-profile-dialog.component';

const routes: Routes = [
  { path: 'new-profile', component: NewProfileDialogComponent },
  { path: 'rename-profile', component: RenameProfileDialogComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DialogsRoutingModule {}
