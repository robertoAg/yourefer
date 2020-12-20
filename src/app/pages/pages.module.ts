import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { CommonModule } from '@angular/common';

const PAGES_COMPONENTS = [
    PagesComponent,
];

@NgModule({
    imports: [
        PagesRoutingModule,
        HomeModule,
        CommonModule,
    ],
    declarations: [
        PagesComponent,
    ],
    providers: [],
    bootstrap: [PagesComponent]
  })
export class PagesModule {
}
