import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ProjectsComponent } from './projects/projects.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { ProjectIdComponent } from './projects/project-id/project-id.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatListModule } from '@angular/material/list'
import { StoreModule } from '@ngrx/store'
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment'
import { metaReducers, reducers } from './store/app.state'
import { LoginComponent } from './auth/login/login.component'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { JwtModule } from '@auth0/angular-jwt'
import { MatTreeModule } from '@angular/material/tree'
import { MatIconModule } from '@angular/material/icon'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatMenuModule } from '@angular/material/menu'
import { MatGridListModule } from '@angular/material/grid-list'
import { ProjectTreeComponent } from './projects/project-id/components/project-tree/project-tree.component'
import { MatSortModule } from '@angular/material/sort'
import { JwtInterceptor } from './interceptors/jwt.interceptor'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { GridLayoutComponent } from './projects/project-id/components/grid-layout/grid-layout.component'
import { ButtonMenuComponent } from './projects/project-id/components/project-tree/button-menu/button-menu.component'
import { FilterStringsPipe } from './pipes/v1/filter-strings.pipe'
import { FilterPanelsPipe } from './pipes/v1/filter-panels.pipe'
import { GridInventoryComponent } from './projects/project-id/components/deprecated/grid-inventory/grid-inventory.component'
import { TrackerTreeComponent } from './projects/project-id/components/deprecated/tracker-tree/tracker-tree.component'
import { StringStatsComponent } from './projects/project-id/components/deprecated/string-stats/string-stats.component'
import { MatTooltipModule } from '@angular/material/tooltip'
import { TrackerStatsComponent } from './projects/project-id/components/deprecated/tracker-stats/tracker-stats.component'
import { FilterTrackersPipe } from './pipes/v1/filter-trackers.pipe'
import { StatsSectionComponent } from './projects/project-id/components/project-tree/stats-section/stats-section.component'
import { FilterPanelsByPipe } from './pipes/v2/filter-panels-by.pipe'
import { FilterStringsByPipe } from './pipes/v2/filter-strings-by.pipe'
import { MatToolbarModule } from '@angular/material/toolbar'
import { GridToolbarComponent } from './projects/project-id/components/grid-layout/grid-toolbar/grid-toolbar.component'
import { FilterBlocksByPipe } from './pipes/v2/filter-blocks-by.pipe'
import { FindBlockPipe } from './pipes/v2/find-block.pipe'
import { FindPanelPipe } from './pipes/v2/find-panel.pipe'
import { EffectsModule } from '@ngrx/effects'
import { FindCablePipe } from './pipes/v2/find-cable.pipe'
import { CablesEffects } from './projects/store/cable/cables.effects'
import { PanelsEffects } from './projects/store/panels/panels.effects'
import { GetGridNumberPipe } from './pipes/get-grid-number.pipe'
import { LetModule } from '@ngrx/component'
import { FindPanelLocationPipe } from './pipes/find-panel-location.pipe'
import { FindCableLocationPipe } from './pipes/find-cable-location.pipe'
import { FindBlockNumberPipe } from './pipes/find-block-number.pipe'
import {
  DefaultDataServiceConfig,
  EntityDataModule,
  EntityDataService,
  EntityDefinitionService,
  HttpUrlGenerator,
} from '@ngrx/data'
import { entityConfig } from './entity-metadata'
import { PanelsEntityService } from './projects/project-id/services/panels-entity/panels-entity.service'
import { PanelsResolver } from './projects/project-id/services/panels-entity/panels.resolver'
import { PanelsDataService } from './projects/project-id/services/panels-entity/panels-data.service'
import { PanelsEntityEffects } from './projects/project-id/services/panels-entity/panels-entity.effects'
import { CablesEntityEffects } from './projects/project-id/services/cables-entity/cables-entity.effects'
import { CablesDataService } from './projects/project-id/services/cables-entity/cables-data.service'
import { CablesEntityService } from './projects/project-id/services/cables-entity/cables-entity.service'
import { CablesResolver } from './projects/project-id/services/cables-entity/cables.resolver'
import { GetGridStringPipe } from './pipes/get-grid-string.pipe'
import { defaultDataServiceConfig } from './data-service'
import { StringsDataService } from './projects/project-id/services/strings-entity/strings-data.service'
import { StringsEntityService } from './projects/project-id/services/strings-entity/strings-entity.service'
import { StringsResolver } from './projects/project-id/services/strings-entity/strings.resolver'
import { CustomHttpUrlGenerator } from './http-url-generator'
import { MatSelectModule } from '@angular/material/select'
import { SelectStringComponent } from './projects/project-id/components/grid-layout/grid-toolbar/select-string/select-string.component'
import { MatDialogModule } from '@angular/material/dialog'
import { StringsEntityEffects } from './projects/project-id/services/strings-entity/strings-entity.effects'
import { TrackersEntityService } from './projects/project-id/services/trackers-entity/trackers-entity.service'
import { TrackersResolver } from './projects/project-id/services/trackers-entity/trackers.resolver'
import { TrackersDataService } from './projects/project-id/services/trackers-entity/trackers-data.service'
import { InvertersEntityService } from './projects/project-id/services/inverters-entity/inverters-entity.service'
import { InvertersResolver } from './projects/project-id/services/inverters-entity/inverters.resolver'
import { InvertersDataService } from './projects/project-id/services/inverters-entity/inverters-data.service'
import { FindInverterLocationPipe } from './pipes/find-inverter-location.pipe'
import { InvertersEntityEffects } from './projects/project-id/services/inverters-entity/inverters-entity.effects'
import { JoinsEntityService } from './projects/project-id/services/joins-entity/joins-entity.service'
import { JoinsResolver } from './projects/project-id/services/joins-entity/joins.resolver'
import { JoinsDataService } from './projects/project-id/services/joins-entity/joins-data.service'
import { GetCableSurroundingsPipe } from './pipes/get-cable-surroundings.pipe'

export function tokenGetter() {
  // console.log(localStorage.getItem('token'))
  return localStorage.getItem('token')
}

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    ProjectIdComponent,
    LoginComponent,
    ProjectTreeComponent,
    GridLayoutComponent,
    ButtonMenuComponent,
    FilterStringsPipe,
    FilterPanelsPipe,
    GridInventoryComponent,
    TrackerTreeComponent,
    StringStatsComponent,
    TrackerStatsComponent,
    FilterTrackersPipe,
    StatsSectionComponent,
    FilterPanelsByPipe,
    GridToolbarComponent,
    SelectStringComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatListModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['http://localhost:3000'],
        // disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
    MatGridListModule,
    MatSortModule,
    DragDropModule,
    MatTooltipModule,
    FilterStringsByPipe,
    MatToolbarModule,
    FilterBlocksByPipe,
    FindBlockPipe,
    FindPanelPipe,
    EffectsModule.forRoot([
      CablesEffects,
      PanelsEffects,
      PanelsEntityEffects,
      CablesEntityEffects,
      StringsEntityEffects,
      InvertersEntityEffects,
    ]),
    FindCablePipe,
    GetGridNumberPipe,
    LetModule,
    FindPanelLocationPipe,
    FindCableLocationPipe,
    FindBlockNumberPipe,
    EntityDataModule.forRoot(entityConfig),
    GetGridStringPipe,
    MatSelectModule,
    MatDialogModule,
    FindInverterLocationPipe,
    GetCableSurroundingsPipe,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    PanelsEntityService,
    PanelsResolver,
    PanelsDataService,
    CablesEntityService,
    CablesResolver,
    CablesDataService,
    StringsEntityService,
    StringsResolver,
    StringsDataService,
    TrackersEntityService,
    TrackersResolver,
    TrackersDataService,
    InvertersEntityService,
    InvertersResolver,
    InvertersDataService,
    JoinsEntityService,
    JoinsResolver,
    JoinsDataService,
    CustomHttpUrlGenerator,
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
    { provide: HttpUrlGenerator, useClass: CustomHttpUrlGenerator },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private eds: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private panelsDataService: PanelsDataService,
    private cablesDataService: CablesDataService,
    private stringsDataService: StringsDataService,
    private trackersDataService: TrackersDataService,
    private invertersDataService: InvertersDataService,
    private joinsDataService: JoinsDataService,
  ) {
    eds.registerMetadataMap(entityConfig.entityMetadata)

    entityDataService.registerService('Panel', panelsDataService)
    entityDataService.registerService('Cable', cablesDataService)
    entityDataService.registerService('String', stringsDataService)
    entityDataService.registerService('Tracker', trackersDataService)
    entityDataService.registerService('Inverter', invertersDataService)
    entityDataService.registerService('Join', joinsDataService)
  }
}
