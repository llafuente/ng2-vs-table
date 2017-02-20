import {Component, Output, EventEmitter} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

/**
 * @example
 * <filter-number (onChange)="list.setFilter('name', 'equal', $event)"></filter-number>
 */
@Component({
  selector: 'vs-filter-number',
  template: `
    <input
      type="number"
      [(ngModel)]="value"
      (ngModelChange)="update($event)"
      class="form-control" />
  `,
})
export class FilterNumber {
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  value: String;

  update(val: String): void {
    this.onChange.emit(val);
  }
}
