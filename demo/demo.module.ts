import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {VSTableModule} from '../src';
import {Demo} from './demo.component';
import {MockBackend} from '@angular/http/testing';

import {
  HttpModule,
  Http,
  BaseRequestOptions,
  Response,
  ResponseOptions,
  Headers,
  XHRBackend,
  RequestOptions
} from '@angular/http';

declare var faker: any;

@NgModule({
  declarations: [Demo],
  imports: [BrowserModule, VSTableModule, FormsModule, HttpModule],
  bootstrap: [Demo],
  providers: [
    BaseRequestOptions,
    MockBackend,
    {
      provide: Http,
      deps: [MockBackend, BaseRequestOptions],
      useFactory: (backend, options) => { return new Http(backend, options); }
    }
  ],
})
export class DemoModule {
  // fake request
  constructor(private backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
    // cache this value do not modify everytime...
    let count: number = Math.max(100, Math.floor(Math.random() * 100));

    this.backend.connections.subscribe( connection => {
      console.log('request', connection.request);

      var headers: Headers = new Headers();
      headers.set('X-Total-Count', "" + count);

      var body: any[] = [];
      for (let i: number = 0; i < 10; ++i) {
        body.push({
          id: i + 1,
          name: faker.name.findName(),
          role: ['admin', 'user'][Math.random() > 0.5 ? 1 : 0]
        });
      }

      connection.mockRespond(new Response(new ResponseOptions({
        headers: headers,
        body: JSON.stringify(body)
      })));
    });
  }
}
