import { importProvidersFrom, NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { JwtInterceptor } from '@auth/interceptors'
import { CurrentProjectInterceptor } from '@shared/interceptors'
import {
  DisconnectionPointsDataService,
  DisconnectionPointsEntityService, DisconnectionPointsResolver,
  PanelLinksDataService,
  PanelLinksEntityService, PanelLinksResolver,
  PanelsDataService,
  PanelsEntityService,
  PanelsResolver, projectsReducer, StringsDataService,
  StringsEntityService, StringsResolver, TraysDataService, TraysEntityService, TraysResolver,
} from '@grid-layout/data-access/store'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { StoreModule } from '@ngrx/store'

const routes: Routes = [
  {
    path: 'project-grid/:projectId',
    // path: '',
    loadComponent: () =>
      import('./pages/project-grid/project-grid.page').then(mod => mod.ProjectGridPage),
    providers: [
      importProvidersFrom(
        // register feature reducer
        StoreModule.forFeature('projects', projectsReducer),
        // run feature effects
      ),
    ]
  },
/*  {
    path: 'project-grid/:projectId',
    loadChildren: async () =>
     (await import('@grid-layout/shell')).GridLayoutModule
  },*/
  { path: '', redirectTo: '/project-grid/1', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
