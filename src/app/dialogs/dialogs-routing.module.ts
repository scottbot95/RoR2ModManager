import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';

const routes: Routes = [
  {
    path: 'importProfile',
    component: ImportDialogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DialogsRoutingModule {}
