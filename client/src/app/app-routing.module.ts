import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProjectsComponent } from './projects/projects.component'
import { ProjectIdComponent } from './projects/project-id/project-id.component'
import { PanelsResolver } from './projects/project-id/services/ngrx-data/panels-entity/panels.resolver'
import { StringsResolver } from './projects/project-id/services/ngrx-data/strings-entity/strings.resolver'
import { PanelLinksResolver } from './projects/project-id/services/ngrx-data/panel-links-entity/panel-links.resolver'

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
      strings: StringsResolver,
      panelLinks: PanelLinksResolver,
      /*      cables: CablesResolver,
            trackers: TrackersResolver,
            inverters: InvertersResolver,
            joins: JoinsResolver,
            panel_joins: PanelLinksResolver,
            disconnection_points: DisconnectionPointsResolver,
            trays: TraysResolver,
            rails: RailsResolver,*/
    },
  },
  { path: '', redirectTo: '/projects/3', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
