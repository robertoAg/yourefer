import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WhatComponent } from './what/what.component';
import { PagesComponent } from './pages.component';
import { AuthGuard } from './../_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const platformsModule = () => import('./platforms/platforms.module').then(x => x.PlatformsModule);
const listModule = () => import('./list/list.module').then(x => x.ListModule);

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: '',
        component: WhatComponent,
        children: [
            {
                path: 'what',
                component: WhatComponent
            },
        ],
    },
    { path: 'list', loadChildren: listModule },
    { path: 'platforms', loadChildren: platformsModule },
    { path: 'users', loadChildren: usersModule },
    { path: 'account', loadChildren: accountModule },
    { path: '**', redirectTo: '' },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    })
    export class PagesRoutingModule {
}
