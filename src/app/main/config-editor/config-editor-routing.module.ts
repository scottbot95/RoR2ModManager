import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FoundConfigTableComponent } from './found-config-table/found-config-table.component';

const routes: Routes = [
  {
    path: '',
    component: FoundConfigTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigEditorRoutingModule {}
