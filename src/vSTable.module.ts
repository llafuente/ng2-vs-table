import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Table} from './table.component';
import {SelectableRow} from './selectablerow.directive';
import {OrderBy} from './orderby.component';
import {FilterNumber} from './filternumber.component';
import {FilterText} from './filtertext.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    Table,
    SelectableRow,
    OrderBy,
    FilterNumber,
    FilterText,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    Table,
    SelectableRow,
    OrderBy,
    FilterNumber,
    FilterText,
  ]
})
export class VSTableModule {}
