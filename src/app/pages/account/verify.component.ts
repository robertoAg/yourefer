import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: 'verify.component.html',
  styleUrls: []
})
export class VerifyComponent implements OnInit {

  token: string;
  response: string;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.params.token;
    this.accountService.verify(this.token)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
          this.router.navigate(['../login'], { relativeTo: this.route });
        },
        error: () => {
          this.alertService.error('Verification failed');
        }
      });
  }
}
