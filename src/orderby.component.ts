import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

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
  @Input() property: string = null;
  @Input() order: string = null;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    if (null == this.property) {
      throw new Error('Attribute "property" is required');
    }
    if (null == this.order) {
      throw new Error('Attribute "order" is required');
    }
    //?? if(this.onChange. == 0) throw new Error('Attribute "onChange" is required');
  }

  updateOrder(): void {
    this.onChange.emit(this.property);
  }
}
