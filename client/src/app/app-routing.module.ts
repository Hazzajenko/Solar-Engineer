import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectIdComponent } from './projects/project-id/project-id.component';

const routes: Routes = [
  {
    path: 'projects',
    component: ProjectsComponent,
    /*    children: [
          {
            path: ':projectId',
            component: ProjectIdComponent,
          },
        ],*/
  },
  {
    path: 'projects/:projectId',
    component: ProjectIdComponent,
  },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
