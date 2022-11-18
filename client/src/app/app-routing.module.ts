import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProjectsComponent } from './projects/projects.component'
import { ProjectIdComponent } from './projects/project-id/project-id.component'
import { PanelsResolver } from './projects/project-id/services/panels-entity/panels.resolver'
import { CablesResolver } from './projects/project-id/services/cables-entity/cables.resolver'

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
    resolve: {
      panels: PanelsResolver,
      cables: CablesResolver,
    },
  },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
