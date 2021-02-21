import { Component, HostBinding } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0, padding: '50px 0' }),
        animate('1300ms', style({ opacity: 1, padding: '0 0' })),
      ]),
      transition(':leave', [
        animate('1300ms', style({ opacity: 0 }))
      ])
    ]),
  ],
})
export class HomeComponent {
  user: User;
  isShown: Array<boolean> = [false, false, false, false];

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
    this.isShown[0] = true;
    setTimeout(() => this.isShown[1] = true, 1000);
    setTimeout(() => this.isShown[2] = true, 2000);
    setTimeout(() => this.isShown[3] = true, 3000);
  }
}
