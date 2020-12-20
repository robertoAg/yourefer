import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User, Platform } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class PlatformService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
    }

    // tslint:disable-next-line:typedef
    getAll() {
        return this.http.get<Platform[]>(`${environment.apiUrl}/platforms`);
    }
}
