import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { ListRoutingModule } from './list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ListRoutingModule,
    FormsModule
  ],
  declarations: [
    LayoutComponent,
    ListComponent
  ]
})
export class ListModule { }
