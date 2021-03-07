import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, PlatformService } from '@app/_services';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/_models';

@Component({
  templateUrl: 'platforms.component.html',
  styleUrls: ['platforms.component.css']
})
export class PlatformsComponent implements OnInit {
  user: User;
  code: string;
  form: FormGroup;
  loading = false;

  platforms = null;
  filteredPlatforms;
  categories = [];

  filteredSuply = 0;
  totalSuply = 0;

  constructor(
    private platformService: PlatformService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    if (this.code) {
      this.code = this.route.snapshot.params.code;
      this.accountService.getByCode(this.code)
        .pipe(first())
        .subscribe(x => this.form.patchValue(x));

      console.log(this.accountService.userValue);
      this.accountService.user.subscribe(x => this.user = x);
    }

    this.platformService.getAll()
      .pipe(first())
      .subscribe(platforms => {
        this.platforms = this.addLink(platforms);
        this.filteredPlatforms = [...this.platforms];
        this.totalSuply = this.platforms.length;
        this.filteredSuply = this.filteredPlatforms.length;
        this.categories = this.extractCategories(platforms);
      });
  }

  extractCategories(platforms): any[] {
    const categories = platforms.map((platform) => {
      return platform.categories;
    });
    return [...new Set(categories.flat(1))];
  }

  // tslint:disable-next-line:typedef
  filtering(categories) {
    this.filteredPlatforms = this.platforms.filter(platform => {
      let i = 0;
      let aux = false;
      while (categories.length > i && !aux) {
        aux = platform.categories.includes(categories[i]);
        i++;
      }
      return aux;
    });
    this.filteredSuply = this.filteredPlatforms.length;
  }

  // tslint:disable-next-line:typedef
  addLink(platforms) {
    platforms.forEach(platform => {
      let userPlatform;
      if (this.user && this.user.platforms) {
        userPlatform = this.user.platforms.find(uP => {
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
