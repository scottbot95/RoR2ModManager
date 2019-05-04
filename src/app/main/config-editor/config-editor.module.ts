import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigEditorRoutingModule } from './config-editor-routing.module';
import { FoundConfigTableComponent } from './found-config-table/found-config-table.component';

@NgModule({
  declarations: [FoundConfigTableComponent],
  imports: [
    CommonModule,
    ConfigEditorRoutingModule
  ]
})
export class ConfigEditorModule { }
