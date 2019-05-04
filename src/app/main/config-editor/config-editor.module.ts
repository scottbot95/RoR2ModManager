import { NgModule } from '@angular/core';

import { ConfigEditorRoutingModule } from './config-editor-routing.module';
import { FoundConfigTableComponent } from './found-config-table/found-config-table.component';
import { SharedModule } from '../../shared/shared.module';
import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [FoundConfigTableComponent, EditorComponent],
  imports: [SharedModule, ConfigEditorRoutingModule]
})
export class ConfigEditorModule {}
