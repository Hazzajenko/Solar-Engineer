import { inject, NgModule } from '@angular/core'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { HTTP_INTERCEPTORS} from '@angular/common/http'
import {
  BlocksEffects,
  DisconnectionPointsDataService,
  DisconnectionPointsEntityEffects,
  entityConfig,
  PanelLinksDataService,
  PanelsDataService,
  PanelsEntityEffects,
  SelectedEffects,
  StringsDataService,
  StringsEntityEffects,
  TraysDataService,
  TraysEntityEffects,
  StringsResolver,
  PanelLinksResolver,
  PanelsResolver,
  TraysResolver,
  PanelsEntityService,
  TraysEntityService,
  StringsEntityService,
  DisconnectionPointsResolver,
  PanelLinksEntityService,
  DisconnectionPointsEntityService
} from '@grid-layout/data-access/store'
import { EntityDataModule, EntityDataService, EntityDefinitionService } from '@ngrx/data'
import { RouterModule } from '@angular/router'
import { ProjectGridPage } from '../../../../../apps/solarengineer/src/app/pages/project-grid/project-grid.page'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { JwtInterceptor } from '@auth/interceptors'
import { CurrentProjectInterceptor } from '@shared/interceptors'
import { CommonModule } from '@angular/common'
@NgModule({
  imports: [
    CommonModule,
    // StoreModule.forFeature('grid', gridReducers),
    // StoreModule.forFeature('projects', projectsReducer),
    // StoreModule.forFeature('grid', gridReducers, { metaReducers }),
    RouterModule.forChild([
      {
        path: '',
        component: ProjectGridPage,
        resolve: {
          panels: PanelsResolver,
          strings: StringsResolver,
          panelLinks: PanelLinksResolver,
        },
      },
    ]) /*
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
    }),*/,
    EffectsModule.forFeature([
      PanelsEntityEffects,
      StringsEntityEffects,
      DisconnectionPointsEntityEffects,
      SelectedEffects,
      TraysEntityEffects,
      BlocksEffects,
    ]),
    EntityDataModule.forRoot(entityConfig),
    ProjectGridPage
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CurrentProjectInterceptor,
      multi: true,
    },
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
  ],
  // bootst: [ProjectGridPage]
})
export class GridLayoutModule {
  private eds = inject(EntityDefinitionService)
  private entityDataService = inject(EntityDataService)
  private panelsDataService = inject(PanelsDataService)
  private stringsDataService = inject(StringsDataService)
  private panelLinksDataService = inject(PanelLinksDataService)
  private disconnectionPointsDataService = inject(DisconnectionPointsDataService)
  private traysDataService = inject(TraysDataService)

  constructor() {
    this.eds.registerMetadataMap(entityConfig.entityMetadata)
    this.entityDataService.registerService('Panel', this.panelsDataService)
    this.entityDataService.registerService('String', this.stringsDataService)
    this.entityDataService.registerService('PanelLink', this.panelLinksDataService)
    this.entityDataService.registerService('Tray', this.traysDataService)
    this.entityDataService.registerService(
      'DisconnectionPoint',
      this.disconnectionPointsDataService,
    )
  }
}
