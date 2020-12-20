import { Component } from '@angular/core';
import { User } from './_models';
import { PlatformService } from './_services';
import { AccountService } from './_services/account.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
  <app-nav></app-nav>
  <!-- main app container -->
  <div class="app-container">
      <alert></alert>
      <router-outlet></router-outlet>
  </div>
  <p>listcode: {{listcode}}</p>
  <p>table</p>
  <table>
  <tbody>
  <tr *ngFor="let platform of platforms"><td>{{platform.name}}</td></tr>
  </table>
  `
})
export class AppComponent {
    user: User;
    platforms: any;

    listcode: string;

    constructor(private accountService: AccountService, private platformService: PlatformService) {

        const url = window.location.href;
        if (url.indexOf('/listcode/') !== -1) {
            const code = url.substring(url.indexOf('/listcode/') + 10, url.indexOf('/listcode/') + 10 + 20);
        }

        this.accountService.user.subscribe(x => this.user = x);

        this.platformService.getAll()
            .pipe(first())
            .subscribe(platforms => this.platforms = platforms);
    }

    // tslint:disable-next-line:typedef
    logout() {
        this.accountService.logout();
    }

}
