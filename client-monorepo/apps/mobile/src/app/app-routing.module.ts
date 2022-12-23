import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {JwtInterceptor} from "../../../../libs/auth/data-access/interceptors/src";

const routes: Routes = [
  {
    path: 'projects',
    loadComponent: () =>
      import('./projects/projects.page').then((m) => m.ProjectsPage),
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true,
      },
    ]
  },
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
