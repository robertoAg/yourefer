import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, PlatformService } from '@app/_services';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/_models';
import { UserService } from '@app/_services/user.service';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})
export class ListComponent implements OnInit {
  submitted: boolean;
  user: User;
  userByCode: User;
  canEdit = false;
  code: string;
  username: string;
  form: FormGroup;
  loading = false;

  platforms = null;

  shareable = '';
  shareableClicked = false;

  public platformsForm: FormArray;

  constructor(
    private formBuilder: FormBuilder,
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
      if (routeParams.code) {
        this.loadByCode(routeParams.code);
      } else if (routeParams.username) {
        this.loadByUsername(routeParams.username);
      }
    });

    this.accountService.user.subscribe(x => this.user = x);

    this.shareable = this.user ? location.host + '/list/of/' + this.user.username : '';

    this.platformsForm = this.formBuilder.array([]);
  }

  // tslint:disable-next-line:typedef
  removeFormControl(i) {
    const platformsArray = this.platformsForm as FormArray;
    platformsArray.removeAt(i);
  }

  // tslint:disable-next-line:typedef
  addPlatformFormControl(platform) {
    const platformsArray = this.platformsForm as FormArray;
    const arraylen = platformsArray.length;

    const newUsergroup: FormGroup = this.formBuilder.group({
      link: [platform.link, Validators.pattern(platform.validation)]
    });
    platformsArray.insert(arraylen, newUsergroup);
  }

  // tslint:disable-next-line:typedef
  loadByUsername(username) {
    this.userService
      .getByUsername(username)
      .subscribe(
        val => {
          console.log('Value emitted successfully', val);
          this.userByCode = (val) ? val : {};
          if (this.userByCode && this.user && this.user.username === this.userByCode.username) {
            this.canEdit = true;
          }
          if (!sessionStorage.getItem('referredBy')) {
            sessionStorage.setItem('referredBy', this.userByCode.username);
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
  loadByCode(code) {
    this.userService
      .getByCode(code)
      .subscribe(
        val => {
          console.log('Value emitted successfully', val);
          this.userByCode = (val) ? val : {};
          if (this.userByCode && this.user && this.user.username === this.userByCode.username) {
            this.canEdit = true;
          }
          if (!sessionStorage.getItem('referredBy')) {
            sessionStorage.setItem('referredBy', this.userByCode.username);
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
      if (userPlatform && userPlatform.link) {
        platform.link = userPlatform.link;
        platform.linkOnInit = true;
      } else {
        platform.link = '';
        platform.linkOnInit = false;
      }
    });

    /* ordenar no solo si tienen link tb por como las tiene ordenadas el usuario */
    platforms.sort(this.orderPlatforms);

    platforms.forEach(platform => {
      this.addPlatformFormControl(platform);
    });

    return platforms;
  }

  // tslint:disable-next-line:typedef
  orderPlatforms = (a, b) => {
    const userPlatformA = this.user.platforms.find(uP => {
      return uP.skuname === a.skuname;
    });
    const userPlatformB = this.user.platforms.find(uP => {
      return uP.skuname === b.skuname;
    });
    if (userPlatformA) {
      if (userPlatformB) {
        if (!userPlatformA.link) {
          return 1;
        }
        if (!userPlatformB.link) {
          return -1;
        }
        const userPlatformAIndex = this.user.platforms.indexOf(userPlatformA);
        const userPlatformBIndex = this.user.platforms.indexOf(userPlatformB);
        if (userPlatformAIndex < userPlatformBIndex) {
          return -1;
        } else {
          return 1;
        }
      } else {
        return -1;
      }
    }
    return 1;
  }

  // tslint:disable-next-line:typedef
  savePlatformLink(platform, i) {

    this.submitted = true;
    this.alertService.clear();
    // stop here if form is invalid
    if (this.platformsForm.invalid) {
      return;
    }

    if (!this.user.platforms) {
      this.user.platforms = [];
    }
    const userPlatform = this.user.platforms.find(uP => {
      return uP.skuname === platform.skuname;
    });
    if (userPlatform) {
      userPlatform.link = this.platformsForm.at(i).value.link;
      platform.link = this.platformsForm.at(i).value.link;
    } else {
      this.user.platforms.push({
        skuname: platform.skuname,
        link: this.platformsForm.at(i).value.link
      });
    }
    platform.addingLink = false;
    platform.editingLink = false;
    if (platform.link || platform.link === '') {
      platform.linkOnInit = true;
    } else {
      platform.linkOnInit = false;
    }

    this.platforms.sort(this.orderPlatforms);

    this.resetPlatformsForm();

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

  // tslint:disable-next-line:typedef
  shareableClicking() {
    this.shareableClicked = true;
    setTimeout(() => {
      this.shareableClicked = false;
    }, 500);
  }

  order(from, to, platform): void {
    this.platforms.splice(from, 1);
    this.platforms.splice(to, 0, platform);
    const userPlatform = this.user.platforms.find(uP => {
      return uP.skuname === platform.skuname;
    });
    if (userPlatform) {
      const userPlatformIndexFrom = this.user.platforms.indexOf(userPlatform);
      let userPlatformIndexTo = userPlatformIndexFrom + 1;
      if (from > to) {
        userPlatformIndexTo = userPlatformIndexFrom - 1;
        while (!this.user.platforms[userPlatformIndexTo].link) {
          userPlatformIndexTo--;
        }
      } else {
        while (!this.user.platforms[userPlatformIndexTo].link) {
          userPlatformIndexTo++;
        }
      }
      this.user.platforms.splice(userPlatformIndexFrom, 1);
      this.user.platforms.splice(userPlatformIndexTo, 0, userPlatform);
    }

    this.resetPlatformsForm();
    this.saveUser();
  }

  resetPlatformsForm(): void {
    this.platformsForm = this.formBuilder.array([]);
    this.platforms.forEach(p => {
      this.addPlatformFormControl(p);
    });
  }
}
