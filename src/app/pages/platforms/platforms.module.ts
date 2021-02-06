import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout.component';
import { PlatformsComponent } from './platforms.component';
import { PlatformsRoutingModule } from './platforms-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PlatformsRoutingModule,
        FormsModule
    ],
    declarations: [
        LayoutComponent,
        PlatformsComponent
    ]
})
export class PlatformsModule { }
