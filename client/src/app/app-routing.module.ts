import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProjectsComponent } from './projects/projects.component'
import { ProjectIdComponent } from './projects/project-id/project-id.component'
import { PanelsResolver } from './projects/project-id/services/ngrx-data/panels-entity/panels.resolver'
import { CablesResolver } from './projects/project-id/services/ngrx-data/cables-entity/cables.resolver'
import { StringsResolver } from './projects/project-id/services/ngrx-data/strings-entity/strings.resolver'
import { TrackersResolver } from './projects/project-id/services/ngrx-data/trackers-entity/trackers.resolver'
import { InvertersResolver } from './projects/project-id/services/ngrx-data/inverters-entity/inverters.resolver'
import { JoinsResolver } from './projects/project-id/services/ngrx-data/joins-entity/joins.resolver'
import { LinksResolver } from './projects/project-id/services/ngrx-data/links-entity/links.resolver'
import { DisconnectionPointsResolver } from './projects/project-id/services/ngrx-data/disconnection-points-entity/disconnection-points.resolver'
import { TraysResolver } from './projects/project-id/services/ngrx-data/trays-entity/trays.resolver'
import { RailsResolver } from './projects/project-id/services/ngrx-data/rails-entity/rails.resolver'

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
      panel_joins: LinksResolver,
      disconnection_points: DisconnectionPointsResolver,
      trays: TraysResolver,
      rails: RailsResolver,
    },
  },
  { path: '', redirectTo: '/projects/3', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
