import { Directive, ElementRef, HostListener, Input, forwardRef, Inject, OnInit} from '@angular/core';
import { Table } from './table.component';

/**
 * Allow row selection
 *
 * #### Example
 *
 * ```html
 * <tr
 *   *ngFor="let row of list2.list; let i = index;"
 *   selectableRow [selectableIndex]="i"
 * >
 *   <td>...</td>
 * </tr>
 * ```
 */
@Directive({
  selector: '[selectableRow]',
  // should be table-active but it0s gray!?
  host: {'[class.table-success]': 'isSelected()'}
})
export class SelectableRow extends OnInit {
  /**
   * row index
   */
  @Input('selectableIndex') index: number = null;

  constructor(
    @Inject(forwardRef(() => Table)) protected ctrl: Table) {
    super();
  }
  /**
   * is this row selected?
   */
  isSelected(): boolean {
    return this.ctrl.isSelected(this.index);
  }
  /**
   * Assert if selectableIndex is null
   */
  ngOnInit(): void {
    if (null == this.index) {
      throw new Error('Attribute "selectableIndex" is required');
    }
  }
  /**
   * Handle click
   */
  @HostListener('click') onMouseClick(): void {
    this.ctrl.selectRow(this.index);
  }
}
