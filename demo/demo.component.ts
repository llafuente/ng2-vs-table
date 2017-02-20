import {Component} from '@angular/core';

@Component({
  selector: 'demo-app',
  template: `
  <h1>Sortable table</h1>
    <vs-table uri="/api/v1/users" #list>
      <thead>
      <tr>
        <th>
          <span>Id</span>
          <vs-order-by
            (onChange)="list.setOrder('id')"
            property="id"
            [order]="list.order"
            ></vs-order-by>
        </th>
        <th>
          <span>Name</span>
          <vs-order-by
            (onChange)="list.setOrder('name')"
            property="name"
            [order]="list.order"
            ></vs-order-by>
        </th>
        <th>
          <span>Role</span>
          <vs-order-by
            (onChange)="list.setOrder('role')"
            property="role"
            [order]="list.order"
            ></vs-order-by>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        *ngFor="let row of list.list; let i = index;"
      >
        <td>{{row.id}}</td>
        <td>{{row.name}}</td>
        <td>{{row.role}}</td>
      </tr>
      </tbody>
    </vs-table>

  <h1>Sortable+Selectable Table</h1>
    <vs-table uri="/api/v1/users" #list2>
      <thead>
      <tr>
        <th>
          <span>Id</span>
          <vs-order-by
            (onChange)="list2.setOrder('id')"
            property="id"
            [order]="list2.order"
            ></vs-order-by>
        </th>
        <th>
          <span>Name</span>
          <vs-order-by
            (onChange)="list2.setOrder('name')"
            property="name"
            [order]="list2.order"
            ></vs-order-by>
        </th>
        <th>
          <span>Role</span>
          <vs-order-by
            (onChange)="list2.setOrder('role')"
            property="role"
            [order]="list2.order"
            ></vs-order-by>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        *ngFor="let row of list2.list; let i = index;"
        selectableRow [selectableIndex]="i"
      >
        <td>{{row.id}}</td>
        <td>{{row.name}}</td>
        <td>{{row.role}}</td>
      </tr>
      </tbody>
    </vs-table>

  <h1>Sortable+Selectable+Filtrable Table</h1>
    <vs-table uri="/api/v1/users" #list3>
      <thead>
      <tr>
        <th>
          <span>Id</span>
          <vs-order-by
            (onChange)="list3.setOrder('id')"
            property="id"
            [order]="list3.order"
            ></vs-order-by>
          <vs-filter-number (onChange)="list3.setFilter('id', 'equal', $event)">
          </vs-filter-number>
        </th>
        <th>
          <span>Name</span>
          <vs-order-by
            (onChange)="list3.setOrder('name')"
            property="name"
            [order]="list3.order"
            ></vs-order-by>
          <vs-filter-text (onChange)="list3.setFilter('name', 'like', $event)">
          </vs-filter-text>
        </th>
        <th>
          <span>Role</span>
          <vs-order-by
            (onChange)="list3.setOrder('role')"
            property="role"
            [order]="list3.order"
            ></vs-order-by>
          <!--
          <vs-filter-select (onChange)="list3.setFilter('name', 'like', $event)">
          </vs-filter-text>
          -->
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        *ngFor="let row of list3.list; let i = index;"
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
export class Demo {
}
