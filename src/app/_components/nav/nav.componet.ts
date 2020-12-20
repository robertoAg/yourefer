import { Component } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component(
    {
        selector: 'app-nav',
        templateUrl: 'nav.component.html' }
)

export class NavComponent{
    user: User;

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    // tslint:disable-next-line:typedef
    logout() {
        this.accountService.logout();
    }

}
