import { Component, ViewChild } from '@angular/core';
import {
  async,
  inject,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {expect} from 'chai';
import {VSTableModule} from '../src';
import {Table} from '../src/table.component';
import { HttpModule, Http, BaseRequestOptions, Response, ResponseOptions, Headers } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

@Component({
  selector: 'checktree-test',
  template: `
    <vs-table uri="/api/v1/users" #table>
      <thead>
      <tr>
        <th>
          <span>Id</span>
          <vs-order-by
            (onChange)="table.setOrder('id')"
            property="id"
            [order]="table.order"
            ></vs-order-by>
          <vs-filter-number (onChange)="table.setFilter('id', 'equal', $event)">
          </vs-filter-number>
        </th>
        <th>
          <span>Name</span>
          <vs-order-by
            (onChange)="table.setOrder('name')"
            property="name"
            [order]="table.order"
            ></vs-order-by>
          <vs-filter-text (onChange)="table.setFilter('name', 'like', $event)">
          </vs-filter-text>
        </th>
        <th>
          <span>Role</span>
          <vs-order-by
            (onChange)="table.setOrder('role')"
            property="role"
            [order]="table.order"
            ></vs-order-by>
          <!--
          <vs-filter-select (onChange)="table.setFilter('name', 'like', $event)">
          </vs-filter-text>
          -->
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        *ngFor="let row of table.list; let i = index;"
        selectableRow [selectableIndex]="i"
      >
        <td>{{row.id}}</td>
        <td>{{row.name}}</td>
        <td>{{row.role}}</td>
      </tr>
      </tbody>
    </vs-table>
  `
})
class TestComponent {
  @ViewChild(Table) table: Table;
}

describe('hello-world component', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [VSTableModule],
      declarations: [TestComponent],
      providers: [
        {
          provide: Http,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions
      ]
    })
    .compileComponents();
  }));

  it('X-Total-Count assert', inject([MockBackend], (mockBackend) => {
    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        headers: new Headers(),
        body: JSON.stringify([])
      })));
    });

    expect(function(): void {
      const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    }).to.throw('X-Total-Count header is required');
  }));

  it('should say hello world', inject([MockBackend], (mockBackend) => {
    mockBackend.connections.subscribe((connection) => {
      const headers: Headers = new Headers();
      headers.set('X-Total-Count', '45');

      connection.mockRespond(new Response(new ResponseOptions({
        headers: headers,
        body: JSON.stringify([{
          id: 1,
          name: 'name1',
          role: 'role1'
        }, {
          id: 2,
          name: 'name2',
          role: 'role2'
        }])
      })));
    });

    const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    let table: Table = fixture.componentInstance.table;

    //
    // selection test
    //
    const list: any = fixture.nativeElement.querySelectorAll('tr');
    // header + 2 rows + 2 footer
    expect(list.length).to.equal(5);

    let selection: any[] = table.getSelection();
    expect(selection.length).to.equal(0);

    list[1].click(); // first is selected!
    selection = table.getSelection();
    expect(selection.length).to.equal(1);
    expect(selection[0].id).to.equal(1);

    list[2].click(); // second is selected!
    selection = table.getSelection();
    expect(selection.length).to.equal(2);
    expect(selection[0].id).to.equal(1);
    expect(selection[1].id).to.equal(2);

    list[2].click(); // second is deselected!
    selection = table.getSelection();
    expect(selection.length).to.equal(1);
    expect(selection[0].id).to.equal(1);

    list[1].click(); // first is deselected!
    selection = table.getSelection();
    expect(selection.length).to.equal(0);

    //
    // order test
    //

    expect(table.refreshTimeout).to.equal(null);
    const orders: any = fixture.nativeElement.querySelectorAll('vs-order-by a');


        // click & force refresh now!
    orders[0].click();
    expect(table.refreshTimeout).to.not.equal(null);
    table.refresh();

    expect(table.order.by).to.equal('id');
    expect(table.order.mod).to.equal('ASC');

    orders[0].click();
    expect(table.refreshTimeout).to.not.equal(null);
    table.refresh();

    expect(table.order.by).to.equal('id');
    expect(table.order.mod).to.equal('DESC');

    orders[1].click();
    expect(table.refreshTimeout).to.not.equal(null);
    table.refresh();

    expect(table.order.by).to.equal('name');
    expect(table.order.mod).to.equal('ASC');

    orders[2].click();
    expect(table.refreshTimeout).to.not.equal(null);
    table.refresh();

    expect(table.order.by).to.equal('role');
    expect(table.order.mod).to.equal('ASC');

    //
    // filters test
    //
    const inputs: any = fixture.nativeElement.querySelectorAll('input');
    // filter: id, name
    expect(inputs.length).to.equal(2);

    // fill id filter: 10
    inputs[0].value = '10';
    inputs[0].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(table.refreshTimeout).to.not.equal(null);
    table.refresh();
    expect(table.getFilter('id').value).to.equal(10);
    expect(table.getFilter('id').operator).to.equal('equal');

    // clear id filter: 10
    inputs[0].value = '';
    inputs[0].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(table.refreshTimeout).to.not.equal(null);
    table.refresh();
    expect(table.getFilter('id')).to.equal(null, 'filter removed');

    // fill name filter: peter
    inputs[1].value = 'peter';
    inputs[1].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(table.refreshTimeout).to.not.equal(null);
    table.refresh();
    expect(table.getFilter('name').value).to.equal('peter');
    expect(table.getFilter('name').operator).to.equal('like');


    table.filters = [];
    // can't set the filter
    table.setFilter('nulltest', 'IS NULL', null);
    expect(table.getFilter('nulltest')).to.equal(null);

    table.setFilter('nulltest', 'IS NULL', null, true);
    expect(table.getFilter('nulltest').value).to.equal(null,
      'filter set with null value');

    table.setFilter('nulltest', 'IS NULL', null, true);
    expect(table.getFilter('nulltest')).not.to.equal(null,
      'null alowed, do not remove');

    table.setFilter('nulltest', 'IS NULL', null, false);
    expect(table.getFilter('nulltest')).to.equal(null,
      'null not allowed, so remove');

    // set again and remove
    table.setFilter('nulltest', 'IS NULL', null, true);
    table.removeFilter('nulltest');
    expect(table.getFilter('nulltest')).to.equal(null);

    //
    // pagination test
    //
    expect(table.totalCount).to.equal(45);
    expect(table.limit).to.equal(10);
    expect(table.pages.length).to.equal(5);

    //
    // getModified test
    //
    expect(table.getModified('id').length).to.equal(0);

    (table.list[0] as any).name = 'new name';

    expect(table.getModified('id').length).to.equal(1);


  }));
});
