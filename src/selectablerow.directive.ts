import { Directive, ElementRef, HostListener, Input, forwardRef, Inject, OnInit} from '@angular/core';
import { Table } from './table.component';


@Directive({
  selector: '[selectableRow]',
  // should be table-active but it0s gray!?
  host: {'[class.table-success]': 'isSelected()'}
})
export class SelectableRow extends OnInit {
  @Input('selectableIndex') index: number = null;

  constructor(
    @Inject(forwardRef(() => Table)) protected ctrl: Table) {
    super();
  }

  isSelected(): boolean {
    return this.ctrl.isSelected(this.index);
  }

  ngOnInit(): void {
    if (null == this.index) {
      throw new Error('Attribute "selectableIndex" is required');
    }
  }

  @HostListener('click') onMouseClick(): void {
    this.ctrl.selectRow(this.index);
  }
}
