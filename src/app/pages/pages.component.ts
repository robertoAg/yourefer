import { Component } from '@angular/core';
import { AccountService } from './../_services';
import { User } from './../_models';

@Component({
    selector: 'app-pages',
    template: `
        <!-- nav -->
        <nav class="navbar navbar-expand navbar-dark bg-dark" *ngIf="user; else elseBlock">
            <div class="navbar-nav">
                <a class="nav-item nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
                <a class="nav-item nav-link" routerLink="/users" routerLinkActive="active">Users</a>
                <a class="nav-item nav-link" (click)="logout()">Logout</a>
            </div>
        </nav>
        <ng-template #elseBlock>
            <nav class="navbar navbar-expand navbar-dark bg-dark">
                <div class="navbar-nav">
                    <a class="nav-item nav-link" routerLink="/account/login" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Login</a>
                    <a class="nav-item nav-link" routerLink="/account/register" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Register</a>
                </div>
            </nav>
        </ng-template>
        <!-- main app container -->
        <div class="app-container">
            <router-outlet></router-outlet>
        </div>
    `,
    styles: []
})
export class PagesComponent {
    user: User;

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    logout(): void {
        this.accountService.logout();
    }
}
