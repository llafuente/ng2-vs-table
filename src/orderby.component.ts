import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

/**
 * Create a sort control
 *
 * TODO REWVIEW this may be simplified like SelectableRow
 *
 * #### Example
 *
 * ```html
 *   <vs-order-by
 *     (onChange)="list.setOrder('id')"
 *     property="id"
 *     [order]="list.order"
 *   ></vs-order-by>
 * ```
 */
@Component({
  selector: 'vs-order-by',
  template: `
  <a
    (click)="updateOrder()"
  >
    <i
      class="fa pull-right"
      [class.fa-sort]="order.by != property"
      [class.fa-sort-desc]="order.by == property && order.mod == 'DESC'"
      [class.fa-sort-asc]="order.by == property && order.mod == 'ASC'"
      aria-hidden="true"
      ></i>
  </a>
  `,
})
export class OrderBy extends OnInit {
  /**
   * Target property
   */
  @Input() property: string = null;
  /**
   * Table.order
   */
  @Input() order: string = null;
  /**
   * Notify changes (when clicked)
   */
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Assert if property or order are null
   */
  ngOnInit(): void {
    if (null == this.property) {
      throw new Error('Attribute "property" is required');
    }
    if (null == this.order) {
      throw new Error('Attribute "order" is required');
    }
    //?? if(this.onChange. == 0) throw new Error('Attribute "onChange" is required');
  }
  /**
   * Notify it's updated
   */
  updateOrder(): void {
    this.onChange.emit(this.property);
  }
}
