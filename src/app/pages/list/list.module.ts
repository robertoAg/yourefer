import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { ListRoutingModule } from './list-routing.module';
import { MainPipe } from '@app/_components/pipe/main-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ListRoutingModule,
    FormsModule,
    MainPipe
  ],
  declarations: [
    LayoutComponent,
    ListComponent
  ]
})
export class ListModule { }
