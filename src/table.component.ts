//our root app component
import {Component, Input, OnInit} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

/**
 * Order type
 */
export class Order {
  by: string;
  mod: string;
}

export class Filter {
  property: string;
  operator: string;
  value: any;
}
/**
 * Metadata added to objects in the list
 */
export class ListObject {
  public $selected: boolean;
};

/**
 * Table component
 *
 * NOTE: Transclude thead and tbody
 *
 * #### Example
 *
 * ```html
 * <vs-table uri="/api/v1/users" #list>
 *   <thead>
 *   <tr>
 *     <th>Id</th>
 *     <th>Name</th>
 *   </tr>
 *   </thead>
 *   <tbody>
 *   <tr
 *     *ngFor="let row of list.list; let i = index;"
 *   >
 *     <td>{{row.id}}</td>
 *     <td>{{row.name}}</td>
 *   </tr>
 *   </tbody>
 * </vs-table>
 * ```
 */
@Component({
  selector: 'vs-table',
  template: `
    <div>
      <table class="table table-striped">
        <ng-content select="thead"></ng-content>
        <ng-content select="tbody"></ng-content>
        <tfoot>
          <tr>
            <td colspan="999">
              <nav aria-label="Items per page" class="float-right">
                <div class="btn-group" role="group" aria-label="Items per page">
                  <button type="button" class="btn btn-secondary"
                    [ngClass]="{'active': limit == 10}"
                    (click)="setLimit(10)">10</button>
                  <button type="button" class="btn btn-secondary"
                    [ngClass]="{'active': limit == 20}"
                    (click)="setLimit(20)">20</button>
                  <button type="button" class="btn btn-secondary"
                    [ngClass]="{'active': limit == 50}"
                    (click)="setLimit(50)">50</button>
                </div>
              </nav>

              <nav aria-label="List navigation">
                <ul class="pagination">
                  <li class="page-item" [ngClass]="{'disabled': currentPage == 0}">
                    <a class="page-link" (click)="previousPage()">
                      <i class="fa fa-angle-double-left" aria-hidden="true"></i>
                    </a>
                  </li>
                  <li class="page-item"
                    [ngClass]="{'active': page == currentPage}"
                    *ngFor="let page of pages">
                    <a class="page-link"
                       (click)="setPage(page)">{{page + 1}}</a>
                  </li>
                  <li class="page-item" [ngClass]="{'disabled': currentPage == pageCount - 1}">
                  <a class="page-link"  (click)="nextPage()">
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </a>
                  </li>
                </ul>
              </nav>
            </td>
          </tr>
          <tr>
            <td colspan="999">
              <span>Total items: {{totalCount}}</span>
              <span>Selected: {{selectedCount}}</span>
            </td>
          </tr>
        </tfoot>
      </table>
<!--
      <pre>
filters: {{filters | json}}
order: {{order | json}}
      </pre>
-->
    </div>
  `,
})
export class Table implements OnInit {
  // inputs
  /**
   * Api URL
   */
  @Input() uri: string;
  /**
   * Microseconds before trigger the refresh
   */
  @Input() refreshDelay: number = 1250;
  /**
   * Don't do the first request
   */
  @Input() starStopped: boolean = false;
  /**
   * Current/Initial order
   */
  @Input() order: Order = {
    'by': null,
    mod: 'ASC'
  };
  /**
   * Current/Initial filters
   * ### Example
   * ```json
   * {
   *   propertyName: {
   *     operator: "",
   *     value: xx
   *   }
   * }
   * ```
   */
  @Input() filters: Filter[] = [];
  /**
   * list of objects from API
   */
  list: ListObject[] = [];
  /**
   * cloned list for use it at getModified
   */
  original: ListObject[] = [];

  totalCount: number;
  limit: number = 10;
  pages: Number[] = [];
  currentPage: number = 0;
  pageCount: number = 1;

  selectedCount: number = 0; // cache this value

  refreshTimeout: number = null;

  constructor(protected http: Http) {}
  /*
   * refresh unless starStopped
   */
  ngOnInit(): void {
    if (!this.starStopped) {
      this.refresh();
    }
  }
  /**
   * get filter by property
   */
  getFilter(property: string): Filter|null {
    for (let i: number = 0; i < this.filters.length; ++i) {
      if (this.filters[i].property === property) {
        return this.filters[i];
      }
    }

    return null;
  }
  /**
   * Remove filter by property
   */
  removeFilter(property: string): boolean {
    for (let i: number = 0; i < this.filters.length; ++i) {
      if (this.filters[i].property === property) {
        this.filters.splice(i, 1);
        return true;
      }
    }

    return false;
  }
  /*
   * Set/remove filter and queueRefresh
   * Note only 'IS NULL' operator allow value to be null
   * the rest just remove the filter.
   */
  setFilter(property: string, operator: string, value: any, allowNull: boolean = false): void {
    // search property
    let idx: number = -1;
    for (let i: number = 0; i < this.filters.length; ++i) {
      if (this.filters[i].property === property) {
        idx = i;
      }
    }

    // not found create
    if (idx === -1) {
      if (value === null && !allowNull) {
        return;
      }

      if (value === null && allowNull) {
        this.filters.push({
          property: property,
          operator: operator,
          value: null // not really needed here
        });
      } else {
        this.filters.push({
          property: property,
          operator: operator,
          value: value
        });
      }
    } else {
      // update or delete ? :)
      if (
        (value === null && !allowNull) ||
        (typeof value === 'string' && !value.length)
      ) {
        this.filters.splice(idx, 1);
      } else {
        let obj: Filter = this.filters[idx];
        obj.operator = operator;
        obj.value = value;
      }
    }

    this.queueRefresh();
  }
  /**
   * Set order and queueRefresh
   */
  setOrder(prop: string): void {
    if (this.order.by === prop) { // toggle!
      this.order.mod = this.order.mod === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.order.by = prop;
      this.order.mod = 'ASC';
    }
    this.queueRefresh();
  }
  /**
   * Gentle refresh with debounce
   */
  queueRefresh(): void { // debounce
    clearTimeout(this.refreshTimeout);

    this.refreshTimeout = window.setTimeout(() => {
      this.refresh();
    }, this.refreshDelay);
  }
  /**
   * Get HTTP/CSV Observable, you should handle how to save it
   */
  getCSV(): Observable<Response> {
    return this.getHttp(new RequestOptions({
      headers: new Headers({ 'Content-Type': 'text/csv'
    })}));
    /*
    .subscribe(response => {
      console.log(response);
    });
    */
  }
  /*
   * Encode limit, page, filter and order into a string to append to query
   * Override if you need a custom format.
   */
  buildOptionsQuery(): string {
    return 'query=' + JSON.stringify({
      limit: this.limit,
      page: this.currentPage,
      filters: this.filters,
      order: this.order
    });
  }
  /*
   * Parse server response
   * Override if your server response has a custom format.
   */
  parseResponse(response: Response): void {
    this.list = response.json();
    // clean & fast clone :)
    this.original = JSON.parse(JSON.stringify(this.list));
    var t: string = response.headers.get('X-Total-Count');
    if (t == null) {
      throw new Error('X-Total-Count header is required');
    }
    this.totalCount = parseInt(t, 10);
    //this.currentPage = parseInt(response.headers.get('X-Page'), 10);
    //this.limit = parseInt(response.headers.get('X-Limit'), 10);
    this.updatePagination();
  }
  /**
   * Get HTTP Observable
   * This is used for normal list (json) or CSV variant.
   */
  getHttp(options: RequestOptions = undefined): Observable<Response> {
    return this
      .http
      .get(this.uri + '?' + this.buildOptionsQuery(), options);
  }
  /**
   * Refresh the list from the server
   */
  refresh(): any {
    window.clearTimeout(this.refreshTimeout); // also clear here, because pagination it's instant
    this.refreshTimeout = null;

    return this.getHttp()
      .subscribe(
        response => {
          this.parseResponse(response);
        },
        err => console.log(err)
      );
  }
  /**
   * update pagination
   */
  updatePagination(): void {
    this.pageCount = Math.ceil(this.totalCount / this.limit);
    this.pages = Array(this.pageCount).fill(0).map((x, i) => i);
  }
  /**
   * Go to next page and refresh
   */
  nextPage(): void {
    ++this.currentPage;
    this.refresh();
  }
  /**
   * Go to previous page and refresh
   */
  previousPage(): void {
    --this.currentPage;
    this.refresh();
  }
  /**
   * Set current page and refresh
   */
  setPage(page: number): void {
    this.currentPage = page;
    this.refresh();
  }
  /**
   * Remove given row from list
   */
  removeRow(index: number): void {
    this.list.splice(index, 1);
  }
  /**
   * Set limit and refresh
   */
  setLimit(limit: number): void {
    this.limit = limit;
    this.refresh();
  }
  /**
   * Toggle row
   */
  selectRow(index: number): void {
    if (index >= this.list.length) {
      throw new Error('out of bounds');
    }

    this.list[index].$selected = !this.list[index].$selected;
    this.selectedCount = this.getSelection().length;
  }
  /**
   * Is given row selected?
   */
  isSelected(index: number): boolean {
    if (index >= this.list.length) {
      throw new Error('out of bounds');
    }

    return this.list[index].$selected;
  }
  /**
   * Get selected object list
   */
  getSelection(): Object[] {
    return this.list.filter((row: ListObject) => {
      return row.$selected;
    });
  }
  /**
   * Reset list to original values
   */
  restore(): void {
    this.list = JSON.parse(JSON.stringify(this.original));
  }
  /**
   * Get modified values list
   */
  getModified(identifier: string): Object[] {
    var modified:  Object[] = [];

    for (var i: number = 0; i < this.list.length; ++i) {
      for (var j: number = 0; j < this.original.length; ++j) {
        if (this.list[i][identifier] === this.original[j][identifier]) {
          if (JSON.stringify(this.list[i]) !== JSON.stringify(this.original[j])) {
            modified.push(this.list[i]);
          }

          break;
        }
      }
    }

    return modified;
  }
}
