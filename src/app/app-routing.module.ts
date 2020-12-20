import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/pages/home/home.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./../../src/app/pages/pages.module').then(m => m.PagesModule),
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
