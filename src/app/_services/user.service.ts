import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    private url = `${environment.apiUrl}/users`;
    constructor(private  httpClient: HttpClient) { }

    getHeaders(): HttpHeaders {

        const headers = new HttpHeaders();

        headers.set('Content-Type', 'application/json');
        headers.set('Access-Control-Allow-Origin',  '*');
        return headers;
    }

    getByCode(code): any {
        const params = new HttpParams();
        const url = `${this.url}/code/${code}`;
        return this.httpClient
            .get(url, {params, headers: this.getHeaders()});
    }

    getByUsername(username): any {
        const params = new HttpParams();
        const url = `${this.url}/username/${username}`;
        return this.httpClient
            .get(url, {params, headers: this.getHeaders()});
    }

}
