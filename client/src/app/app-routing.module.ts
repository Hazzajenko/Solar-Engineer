import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ProjectIdComponent } from './projects(deprecated)/project-id/project-id.component'
import { PanelsResolver } from './projects(deprecated)/project-id/services/ngrx-data/panels-entity/panels.resolver'
import { StringsResolver } from './projects(deprecated)/project-id/services/ngrx-data/strings-entity/strings.resolver'
import { PanelLinksResolver } from './projects(deprecated)/project-id/services/ngrx-data/panel-links-entity/panel-links.resolver'
import { SceneComponent } from './projects(deprecated)/project-id/version2/scene.component'
import { MapsComponent } from './components/maps/maps.component'
import { ImageEditComponent } from './components/image-edit/image-edit.component'
import { ImageComponent } from './components/image/image.component'
import { VoltageDropComponent } from './components/voltage-drop/voltage-drop.component'
import { ProjectsComponent } from './projects/projects.component'

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
    path: 'projects(deprecated)/:projectId',
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
  {
    path: 'scene',
    component: SceneComponent,
  },
  {
    path: 'maps',
    component: MapsComponent,
  },
  {
    path: 'image-edit',
    component: ImageEditComponent,
  },
  {
    path: 'image',
    component: ImageComponent,
  },
  {
    path: 'voltage-drop',
    component: VoltageDropComponent,
  },
  { path: '', redirectTo: 'voltage-drop', pathMatch: 'full' },
  // { path: '', redirectTo: 'image', pathMatch: 'full' },
  // { path: '', redirectTo: '/projects(deprecated)/3', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
