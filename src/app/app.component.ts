import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <app-nav></app-nav>
  <!-- main app container -->
  <div class="app-container">
      <alert></alert>
      <router-outlet></router-outlet>
  </div>
  `,
  styles: [`.app-container{
    margin-top: 75px;
  }`]
})
export class AppComponent {

    constructor() {
    }

}
