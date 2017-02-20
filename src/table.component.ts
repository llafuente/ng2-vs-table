//our root app component
import {Component, Input, OnInit} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';


class Order {
  by: string;
  mod: string;
}


export class ListObject {
  public $selected: boolean;
};

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
/**
 * @example
 * <list-controller uri="/api/list" #list>
 *   <thead>
 *     <tr><th>xxx</th></tr>
 *   </thead>
 *   <tbody>
 *     <tr *ngFor="let row of list.list; let i = index;">
 *       <td>{{row.xxx}}</td>
 *      </tr>
 *    </tbody>
 * </list-controller>
 */
export class Table implements OnInit {
  // inputs
  /*
   * Api URL
   */
  @Input() uri: string;
  /*
   * Microseconds before trigger the refresh
   */
  @Input() refreshDelay: number = 1250;
  /*
   * Don't do the first request
   */
  @Input() starStopped: boolean = false;
  /*
   * Current/Initial order
   */
  @Input() order: Order = {
    'by': null,
    mod: 'ASC'
  };
  /*
   * Current/Initial filters
   * @example
   * {
   *   propertyName: {
   *     operator: "",
   *     value: xx
   *   }
   * }
   */
  @Input() filters: any = {};

  /*
   * API list of objects
   */
  list: ListObject[] = [];
  /*
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

  ngOnInit(): void {
    if (!this.starStopped) {
      this.refresh();
    }
  }
  /*
   * Note only 'IS NULL' operator allow value to be null
   * the rest just remove the filter.
   */
  setFilter(property: string, operator: string, value: any): void {
    if (operator == 'IS NULL') {
      this.filters[property] = {
        operator: operator,
        value: null // not needed
      };
    } else if (
      value === null ||
      (typeof value == 'string' && !value.length)
    ) {
      delete this.filters[property];
    } else {
      this.filters[property] = {
        operator: operator,
        value: value
      };
    }
    this.queueRefresh();
  }

  setOrder(prop: string): void {
    if (this.order.by === prop) { // toggle!
      this.order.mod = this.order.mod === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.order.by = prop;
      this.order.mod = 'ASC';
    }
    this.queueRefresh();
  }

  queueRefresh(): void { // debounce
    clearTimeout(this.refreshTimeout);

    this.refreshTimeout = window.setTimeout(() => {
      this.refresh();
    }, this.refreshDelay);
  }

  getCSV(): void {
    this.getHttp(new RequestOptions({ headers: new Headers({ 'Content-Type': 'text/csv' })}))
    .subscribe(response => {
      console.log(response);
    });
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

  getHttp(options: RequestOptions = undefined): Observable<Response> {
    return this
      .http
      .get(this.uri + '?' + this.buildOptionsQuery(), options);
  }

  refresh(): any {
    window.clearTimeout(this.refreshTimeout); // also clear here, because pagination it's instant
    this.refreshTimeout = null;

    console.log('refresh!');

    return this.getHttp()
      .subscribe(
        response => {
          this.parseResponse(response);
        },
        err => console.log(err)
      );
  }

  updatePagination(): void {
    this.pageCount = Math.floor(this.totalCount / this.limit);
    this.pages = Array(this.pageCount).fill(0).map((x, i) => i);
  }

  nextPage(): void {
    ++this.currentPage;
    this.refresh();
  }

  previousPage(): void {
    --this.currentPage;
    this.refresh();
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.refresh();
  }

  removeRow(index: number): void {
    this.list.splice(index, 1);
  }

  setLimit(limit: number): void {
    this.limit = limit;
    this.refresh();
  }

  selectRow(index: number): void {
    if (index >= this.list.length) {
      throw new Error('out of bounds');
    }

    this.list[index].$selected = !this.list[index].$selected;
    this.selectedCount = this.getSelection().length;
  }

  isSelected(index: number): boolean {
    if (index >= this.list.length) {
      throw new Error('out of bounds');
    }

    return this.list[index].$selected;
  }

  getSelection(): Object[] {
    return this.list.filter((row: ListObject) => {
      return row.$selected;
    });
  }

  restore(): void {
    this.list = JSON.parse(JSON.stringify(this.original));
  }

  getModified(identifier: string): Object[] {
    var modified:  Object[] = [];

    for (var i: number = 0; i < this.list.length; ++i) {
      for (var j: number = 0; j < this.original.length; ++j) {
        if (this.list[i][identifier] === this.original[j][identifier]) {
          if (JSON.stringify(this.list[i]) === JSON.stringify(this.original[j])) {
            modified.push(this.list[i]);
          }

          break;
        }
      }
    }

    return modified;
  }
}
