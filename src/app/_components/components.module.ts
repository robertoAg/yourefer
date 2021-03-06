import { NgModule } from '@angular/core';
import { FilterComponent } from './filter/filter.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FilterComponent
  ],
  exports: [
    FilterComponent,
  ]
})
export class ComponentsModule { }
