import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FoundConfigTableComponent } from './found-config-table/found-config-table.component';
import { EditorComponent } from './editor/editor.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FoundConfigTableComponent
  },
  {
    path: ':file',
    component: EditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigEditorRoutingModule {}
