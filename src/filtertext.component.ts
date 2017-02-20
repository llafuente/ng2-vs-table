import {Component, Output, EventEmitter} from '@angular/core';

/**
 * @example
 * <filter-text (onChange)="list.setFilter('name', 'equal', $event)"></filter-text>
 */
@Component({
  selector: 'vs-filter-text',
  template: `
    <input
      type="text"
      [(ngModel)]="value"
      (ngModelChange)="update($event)"
      class="form-control" />
  `,
})
export class FilterText {
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  value: String;

  update(val: String): void {
    this.onChange.emit(val);
  }
}
