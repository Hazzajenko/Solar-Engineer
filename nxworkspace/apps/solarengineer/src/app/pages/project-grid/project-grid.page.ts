import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  DisconnectionPointsDataService,
  DisconnectionPointsEntityService,
  DisconnectionPointsResolver,
  entityConfig,
  PanelLinksDataService,
  PanelLinksEntityService,
  PanelLinksResolver,
  PanelsDataService,
  PanelsEntityService,
  PanelsResolver,
  selectMultiState, selectProjectByRouteParams,
  StringsDataService,
  StringsEntityService,
  StringsResolver,
  TraysDataService,
  TraysEntityService,
  TraysResolver,
} from '@grid-layout/data-access/store'
import { selectLinksState } from '@grid-layout/data-access/store'
import { TypeModel } from '@shared/data-access/models'
import { map } from 'rxjs/operators'
import { Store, StoreModule } from '@ngrx/store'
import { AppState } from '@shared/data-access/store'
import { Observable } from 'rxjs'

import { GridComponent } from '@grid-layout/feature/grid'
import { LetModule } from '@ngrx/component'
import { GridToolbarComponent } from '@grid-layout/ui/toolbar'
import { KeymapOverlayComponent } from '@grid-layout/ui/overlays'
import { JwtInterceptor } from '@auth/interceptors'
import { CurrentProjectInterceptor } from '@shared/interceptors'
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { RouterModule } from '@angular/router'
import { EffectsModule } from '@ngrx/effects'
import { DefaultDataServiceConfig, EntityDataModule, EntityDataService, EntityDefinitionService } from '@ngrx/data'
import { defaultDataServiceConfig } from '../../../main'



@Component({
  selector: 'app-project-grid',
  standalone: true,
  imports: [
    CommonModule,
    KeymapOverlayComponent,
    GridToolbarComponent,
    GridComponent,
    LetModule,
    KeymapOverlayComponent,
    // StoreModule.forRoot(gridReducers, { metaReducers }),
/*    RouterModule.forChild([
      {
        path: 'project-grid/:projectId',
        component: ProjectGridPage,
        resolve: {
          panels: PanelsResolver,
          strings: StringsResolver,
          panelLinks: PanelLinksResolver,
        }
      },
    ]),*/
/*    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
    }),*/
/*    EffectsModule.forFeature([
      PanelsEntityEffects,
      StringsEntityEffects,
      DisconnectionPointsEntityEffects,
      SelectedEffects,
      TraysEntityEffects,
      BlocksEffects,
    ]),*/
    // EntityDataModule.forRoot(entityConfig),
  ],
  viewProviders: [
    HttpClientModule,
    EntityDefinitionService,
    EntityDataService,
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
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
    // { provide: DefaultDataServiceConfig, useValue: true },
  ],
/*  providers: [
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
  ],*/
  templateUrl: './project-grid.page.html',
  styleUrls: ['./project-grid.page.scss'],
})
export class ProjectGridPage implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>
  startX: number = 0
  startY: number = 0
  endX: number = 0
  endY: number = 0
  // canvasOffset = this.canvas.nativeElement.offsetTop
  offsetX: number = 0
  offsetY: number = 0
  scrollX: number = 0
  scrollY: number = 0
  isDraggingBool: boolean = false
  isDragging$!: Observable<boolean>
  isLinking$!: Observable<boolean>
  private ctx!: CanvasRenderingContext2D
  private eds = inject(EntityDefinitionService)
  private entityDataService = inject(EntityDataService)
  private panelsDataService = inject(PanelsDataService)
  private stringsDataService = inject(StringsDataService)
  private panelLinksDataService = inject(PanelLinksDataService)
  private disconnectionPointsDataService = inject(DisconnectionPointsDataService)
  private traysDataService = inject(TraysDataService)
  private panelsEntityService = inject(PanelsEntityService)
  private http = inject(HttpClient)

  constructor(private store: Store<AppState>) {
/*    this.eds.registerMetadataMap(entityConfig.entityMetadata)
    this.entityDataService.registerService('Panel', this.panelsDataService)
    this.entityDataService.registerService('String', this.stringsDataService)
    this.entityDataService.registerService('PanelLink', this.panelLinksDataService)
    this.entityDataService.registerService('Tray', this.traysDataService)
    this.entityDataService.registerService(
      'DisconnectionPoint',
      this.disconnectionPointsDataService,
    )*/
  }

  @HostListener('document:mousemove', ['$event'])
  onMultiDrag2(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (this.startX && this.startY && event.altKey && this.isDraggingBool) {
      const mouseX = event.clientX - this.offsetX
      const mouseY = event.clientY - this.offsetY

      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

      const width = mouseX - this.startX
      const height = mouseY - this.startY

      this.ctx.globalAlpha = 0.4

      this.ctx.fillStyle = '#7585d8'
      this.ctx.fillRect(this.startX, this.startY, width, height)

      this.ctx.globalAlpha = 1.0
    } else {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    }
  }

  ngOnInit(): void {
    // this.project$ = this.store.select(selectProjectByRouteParams)
    this.http.get('/api/project/1').subscribe(res => console.log(res))
    this.isDragging$ = this.store.select(selectMultiState).pipe(
      map((multiState) => {
        return !!(multiState.multiMode && multiState.locationStart)
      }),
    )
    this.isLinking$ = this.store.select(selectLinksState).pipe(
      map((linksState) => {
        return !!(linksState.typeToLink === TypeModel.PANEL && linksState.panelToLink)
      }),
    )
  }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.style.width = '100%'
    this.canvas.nativeElement.style.height = '100%'
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight
    this.offsetX = this.canvas.nativeElement.offsetLeft
    this.offsetY = this.canvas.nativeElement.offsetTop
    this.scrollX = this.canvas.nativeElement.scrollLeft
    this.scrollY = this.canvas.nativeElement.scrollTop

    this.ctx = this.canvas.nativeElement.getContext('2d')!
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    console.log('onMouseDown', event)
    const rect = this.canvas.nativeElement.getBoundingClientRect()

    if (event.altKey) {
      this.startX = event.clientX - rect.left
      this.startY = event.clientY - rect.top
      this.endX = event.clientX - rect.left
      this.endY = event.clientY - rect.top

      this.isDraggingBool = true
    } else {
      this.isDraggingBool = false
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    }
  }

  onMouseUp(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    console.log('onMouseUp', event)
    this.isDraggingBool = false
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
  }

  altKeyup(event: KeyboardEvent) {
    event.preventDefault()
    event.stopPropagation()
    // if (event.altKey)
    console.log('ALT-KEYUP', event)
    this.isDraggingBool = false
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
  }

  stopDragging(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDraggingBool = false
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
  }
}
