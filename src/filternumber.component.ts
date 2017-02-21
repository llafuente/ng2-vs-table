import {Component, Output, EventEmitter} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

/**
 * Create a text input for filtering
 *
 * #### Example
 *
 * ```html
 * <vs-filter-number (onChange)="list.setFilter('name', 'equal', $event)"></vs-filter-number>
 * ```
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
  /**
   * Notify changes
   */
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Filter value
   */
  value: String;
  /**
   * Called when model(value) change -> emit onChange
   */
  update(val: String): void {
    this.onChange.emit(val);
  }
}
