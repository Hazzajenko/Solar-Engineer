import { Component, inject, OnInit } from '@angular/core'
import { AuthService } from '@auth/data-access/api'
import { RouterOutlet } from '@angular/router'
import {
  DisconnectionPointsDataService, DisconnectionPointsEntityService, DisconnectionPointsResolver, entityConfig,
  PanelLinksDataService, PanelLinksEntityService, PanelLinksResolver,
  PanelsDataService, PanelsEntityService, PanelsResolver,
  StringsDataService, StringsEntityService, StringsResolver, TraysDataService, TraysEntityService, TraysResolver,
} from '@grid-layout/data-access/store'
import { AppState } from '@shared/data-access/store'
import {
  DefaultDataServiceConfig,
  DefaultDataServiceFactory,
  EntityDataService,
  EntityDefinitionService, HttpUrlGenerator,
} from '@ngrx/data'
import { Store } from '@ngrx/store'
import { defaultDataServiceConfig } from '../main'
import { CustomHttpUrlGenerator } from './http-url-generator'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { HttpClient, HttpClientModule } from '@angular/common/http'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet],
  viewProviders: [
    HttpClientModule,
    EntityDefinitionService,
    EntityDataService,
    DefaultDataServiceFactory,
    PanelsDataService,
    StringsDataService,
    PanelLinksDataService,
    DisconnectionPointsDataService,
    TraysDataService,
    StringsEntityService,
    MatDialogModule,
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
    { provide: HttpUrlGenerator, useClass: CustomHttpUrlGenerator }
    // { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
    // { provide: DefaultDataServiceConfig, useValue: true },
  ],
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'solarengineer'
 private auth = inject(AuthService)
  private http = inject(HttpClient)
   private eds = inject(EntityDefinitionService)
  private entityDataService = inject(EntityDataService)
  private panelsDataService = inject(PanelsDataService)
  private stringsDataService = inject(StringsDataService)
  private panelLinksDataService = inject(PanelLinksDataService)
  private disconnectionPointsDataService = inject(DisconnectionPointsDataService)
  private traysDataService = inject(TraysDataService)

  constructor(private store: Store<AppState>) {
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
  async ngOnInit(): Promise<void> {
    this.http.get('/api/projects/1').subscribe(res => console.log(res))
    await this.auth.signIn({ username: 'string', password: 'Password1' })
  }
}
