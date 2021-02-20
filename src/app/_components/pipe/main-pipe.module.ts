import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParseValidationPipe } from './parse-validation.pipe';


@NgModule({
  declarations: [ParseValidationPipe], // <---
  imports: [CommonModule],
  exports: [ParseValidationPipe] // <---
})

export class MainPipe { }
