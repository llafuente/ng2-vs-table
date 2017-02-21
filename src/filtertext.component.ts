import {Component, Output, EventEmitter} from '@angular/core';

/**
 * Create a number input for filtering
 *
 * #### example
 * ```html
 * <vs-filter-text (onChange)="list.setFilter('name', 'equal', $event)"></vs-filter-text>
 * ```
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
