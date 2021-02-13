import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, PlatformService } from '@app/_services';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/_models';
import { UserService } from '@app/_services/user.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})
export class ListComponent implements OnInit {
  user: User;
  userByCode: User;
  canEdit = false;
  code: string;
  form: FormGroup;
  loading = false;

  platforms = null;

  constructor(
    private platformService: PlatformService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {

    // tslint:disable-next-line:no-shadowed-variable
    this.route.params.subscribe(routeParams => {
      this.loadByCode(routeParams.code);
    });

    this.accountService.user.subscribe(x => this.user = x);

  }

  // tslint:disable-next-line:typedef
  loadByCode(code){
    this.userService
      .getByCode(code)
      .subscribe(
        val => {
          console.log('Value emitted successfully', val);
          this.userByCode = (val) ? val : {};
          if (this.userByCode && this.user && this.user.username === this.userByCode.username) {
            this.canEdit = true;
          }
          this.platformService.getAll()
            .pipe(first())
            .subscribe(platforms => this.platforms = this.addLink(platforms));
        },
        error => {
          console.error('This line is never called ', error);
        },
        () => console.log('HTTP Observable completed...')
      );
  }

  // tslint:disable-next-line:typedef
  addLink(platforms) {
    platforms.forEach(platform => {
      let userPlatform;
      if (this.userByCode.platforms) {
        userPlatform = this.userByCode.platforms.find(uP => {
          return uP.skuname === platform.skuname;
        });
      }
      if (userPlatform) {
        platform.link = userPlatform.link;
        platform.linkOnInit = true;
      } else {
        platform.link = '';
        platform.linkOnInit = false;
      }
    });

    platforms.sort((a, b) => b.link.localeCompare(a.link));

    return platforms;
  }

  // tslint:disable-next-line:typedef
  savePlatformLink(platform) {
    if (!this.user.platforms) {
      this.user.platforms = [];
    }
    const userPlatform = this.user.platforms.find(uP => {
      return uP.skuname === platform.skuname;
    });
    if (userPlatform) {
      userPlatform.link = platform.link;
    } else {
      this.user.platforms.push({
        skuname: platform.skuname,
        link: platform.link
      });
    }
    this.saveUser();
  }

  // tslint:disable-next-line:typedef
  saveUser() {
    this.accountService.update(this.user.id, this.user)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Update successful', { keepAfterRouteChange: true });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  // tslint:disable-next-line:typedef
  edit(platform) {
    platform.editing = true;
  }

  validate(platformValidating): void {
    const originalPlatform = this.platforms.find(platform => {
      return platform.skuname === platformValidating.skuname;
    });
    platformValidating.link = platformValidating.link.trim();
    if (platformValidating.link.includes(platformValidating.validation, 0) && platformValidating.link.length < 70) {
      platformValidating.isValid = true;
    } else {
      platformValidating.isValid = false;
    }
  }

  // tslint:disable-next-line:typedef
  onSubmit() {
    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.updateUser();
  }

  // tslint:disable-next-line:typedef
  private updateUser() {
    this.accountService.update(this.user.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Update successful', { keepAfterRouteChange: true });
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
