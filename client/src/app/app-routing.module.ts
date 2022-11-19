import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProjectsComponent } from './projects/projects.component'
import { ProjectIdComponent } from './projects/project-id/project-id.component'
import { PanelsResolver } from './projects/project-id/services/panels-entity/panels.resolver'
import { CablesResolver } from './projects/project-id/services/cables-entity/cables.resolver'
import { StringsResolver } from './projects/project-id/services/strings-entity/strings.resolver'
import { TrackersResolver } from './projects/project-id/services/trackers-entity/trackers.resolver'
import { InvertersResolver } from './projects/project-id/services/inverters-entity/inverters.resolver'
import { JoinsResolver } from './projects/project-id/services/joins-entity/joins.resolver'

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
      strings: StringsResolver,
      trackers: TrackersResolver,
      inverters: InvertersResolver,
      joins: JoinsResolver,
    },
  },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
