import {
  blocksReducer,
  DisconnectionPointsDataService,
  DisconnectionPointsEntityService,
  DisconnectionPointsResolver, entityConfig, gridReducer, linksReducer, multiReducer,
  PanelLinksDataService, PanelLinksEntityService,
  PanelLinksResolver,
  PanelsDataService, PanelsEntityService, PanelsResolver,
  projectsReducer, selectedReducer,
  StringsDataService, StringsEntityService,
  StringsResolver,
  TraysDataService, TraysEntityService, TraysResolver,
} from '@grid-layout/data-access/store'
import { Routes } from '@angular/router'
import { importProvidersFrom } from '@angular/core'
import { provideState, StoreModule } from '@ngrx/store'
import { HttpClientModule } from '@angular/common/http'
import {
  DefaultDataServiceConfig,
  EntityDataService,
  EntityDefinitionService, HttpUrlGenerator,
  provideEntityData,
} from '@ngrx/data'
import { CustomHttpUrlGenerator } from './http-url-generator'
import { defaultDataServiceConfig } from '../main'


export const routes: Routes = [
  {
    path: 'project-grid/:projectId',
    loadComponent: () =>
      import('./pages/project-grid/project-grid.page').then(mod => mod.ProjectGridPage),
    providers: [
      // provideEntityData(entityConfig),
      provideState('projects', projectsReducer),
      provideState('grid', gridReducer),
      provideState('selected', selectedReducer),
      provideState('links', linksReducer),
      provideState('multi', multiReducer),
      provideState('blocks', blocksReducer),
      importProvidersFrom(
        HttpClientModule,
        PanelsEntityService,
        PanelsResolver,
        PanelsDataService,
        StringsEntityService,
        StringsResolver,
        StringsDataService,
        PanelLinksEntityService,
        PanelLinksResolver,
        PanelLinksDataService,
        DisconnectionPointsEntityService,
        DisconnectionPointsResolver,
        DisconnectionPointsDataService,
        TraysEntityService,
        TraysResolver,
        TraysDataService,
        EntityDefinitionService,
        EntityDataService,
      ),
    ],
    resolve: {
      panels: PanelsResolver,
      strings: StringsResolver,
      panelLinks: PanelLinksResolver,
    },
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./pages/map/map.page').then(mod => mod.MapPage),
  },
  {
    path: 'image-edit',
    loadComponent: () =>
      import('./pages/image-edit/image-edit.page').then(mod => mod.ImageEditPage),
  },
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  // { path: '', redirectTo: '/project-grid/1', pathMatch: 'full' },
]
