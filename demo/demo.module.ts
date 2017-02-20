import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {VSTableModule} from '../src';
import {Demo} from './demo.component';

@NgModule({
  declarations: [Demo],
  imports: [BrowserModule, VSTableModule],
  bootstrap: [Demo],
  providers: []
})
export class DemoModule {}