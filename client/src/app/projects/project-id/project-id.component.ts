import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { combineLatest, Observable } from 'rxjs'
import { InverterModel } from '../models/inverter.model'
import { selectInvertersByProjectId } from '../store/inverters/inverters.selectors'
import { selectTrackersByProjectId } from '../store/trackers/trackers.selectors'
import { selectStringsByProjectId } from '../store/strings/strings.selectors'
import { selectPanelsByProjectId } from '../store/panels/panels.selectors'
import { map } from 'rxjs/operators'
import { TrackerModel } from '../models/tracker.model'
import { StringModel } from '../models/string.model'
import { PanelModel } from '../models/panel.model'
import { ProjectsService } from '../services/projects.service'
import { selectProjectByRouteParams } from '../store/projects/projects.selectors'
import { ProjectModel } from '../models/project.model'
import { StatsService } from '../services/stats.service'
import { PanelsEntityService } from './services/panels-entity/panels-entity.service'
import { v4 as uuid } from 'uuid'
import { Guid } from 'guid-typescript'
import { MatMenuTrigger } from '@angular/material/menu'
import { GridLayoutComponent } from './components/grid-layout/grid-layout.component'
import { AsyncPipe, CommonModule, NgIf } from '@angular/common'
import { GridToolbarComponent } from './components/grid-layout/grid-toolbar/grid-toolbar.component'
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations'
import { MatSliderModule } from '@angular/material/slider'
import { FormsModule } from '@angular/forms'
import { GridLayoutDirective } from '../../directives/grid-layout.directive'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatButtonModule } from '@angular/material/button'

export interface ProjectStore {
  project?: ProjectModel
  inverters?: InverterModel[]
  trackers?: TrackerModel[]
  strings?: StringModel[]
  panels?: PanelModel[]
}

@Component({
  selector: 'app-project-id',
  templateUrl: './project-id.component.html',
  styleUrls: ['./project-id.component.scss'],
  standalone: true,
  imports: [
    GridLayoutComponent,
    NgIf,
    AsyncPipe,
    GridToolbarComponent,
    CommonModule,
    MatSliderModule,
    FormsModule,
    GridLayoutDirective,
    DragDropModule,
    MatButtonModule,
  ],
  animations: [
    trigger('keyframes', [
      transition(':enter', [
        animate(
          '5s',
          keyframes([
            style({ backgroundColor: 'red', offset: 0 }), // 0%
            style({ backgroundColor: 'blue', offset: 0.2 }), // 20%
            style({ backgroundColor: 'orange', offset: 0.3 }), // 30%
            style({ backgroundColor: 'black', offset: 1 }), // 100%
          ]),
        ),
      ]),
    ]),
    trigger('zoom', [
      transition(':enter', [
        animate(
          '5s',
          keyframes([
            style({ zoom: 150 }), // 0%
            /*            style({ backgroundColor: 'blue', offset: 0.2 }), // 20%
                        style({ backgroundColor: 'orange', offset: 0.3 }), // 30%
                        style({ backgroundColor: 'black', offset: 1 }), // 100%*/
          ]),
        ),
      ]),
    ]),
  ],
})
export class ProjectIdComponent implements OnInit {
  zoom: number = 1
  menuTopLeftPosition = { x: '0', y: '0' }
  inverterBool: boolean[] = [false, false, false]
  trackerBool: boolean[] = [false, false, false]
  stringBool: boolean[] = [false, false, false]
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger
  store$?: Observable<ProjectStore>
  trackerTree$!: Observable<{
    project?: ProjectModel
    inverter?: InverterModel
    tracker?: TrackerModel
    strings?: StringModel[]
    panels?: PanelModel[]
  }>
  panels$: Observable<PanelModel[]> | undefined
  gridState$!: Observable<{ selectedStringId?: number }>
  view?: InverterModel
  @ViewChild('app-grid-layout') el!: ElementRef
  dragPosition = { x: 0, y: 0 }
  @ViewChildren('gridLayoutComponent')
  private gridLayoutRef!: QueryList<ElementRef<HTMLInputElement>>

  /*
    @ViewChildren(GridLayoutComponent)
    private gridLayoutComp!: QueryList<GridLayoutComponent>*/

  constructor(
    private store: Store<AppState>,
    private projects: ProjectsService,
    private statsService: StatsService,
    private panelsEntity: PanelsEntityService,
  ) {}

  changePosition() {
    this.dragPosition = {
      x: this.dragPosition.x + 50,
      y: this.dragPosition.y + 50,
    }
  }

  formatLabel(value: number): string {
    return `${value}%`
    /*    if (value >= 1000) {
          return Math.round(value / 1000) + 'k';
        }

        return `${value}`;*/
  }

  onKeyPress(event: any) {
    console.log(event)
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // this.key = event.key;

    console.log(event)
    if (event.key === 'Escape') {
      // ...
      console.log(event)
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    // this.gridLayoutRef.last.nativeElement
    /*    console.log(this.gridLayoutRef)
        if (this.gridLayoutRef.first) {
          this.gridLayoutRef.first.nativeElement.style.top =
            this.gridLayoutRef.first.nativeElement.style.top + 1
        }*/
    /*    this.gridLayoutRef.forEach((lay) => {
          console.log(lay)
          lay.nativeElement.style.top = lay.nativeElement.style.top + 1
        })*/
    // console.log(this.el.nativeElement)
    /*    console.log(this.gridLayoutRef.last.nativeElement)
        console.log(this.gridLayoutRef.get(1)?.nativeElement)
        this.gridLayoutRef.forEach((lay) => {
          console.log(lay)
        })
        console.log(this.gridLayoutRef.first.nativeElement.)*/
    // console.log(this.gridLayoutComp.first)
    // console.log(this.gridLayoutComp.sty)
    // this.gridLayoutComp.first

    if (!event.ctrlKey) return
    event.preventDefault()
    console.log(event.deltaY)
    if (event.ctrlKey) {
      if (event.deltaY < 0) {
        // this.zoom = this.zoom + 1
        // this.zoom = event.deltaY
        if (this.zoom < 100) {
          this.zoom = this.zoom + 0.1
          console.log('ZOOM', this.zoom)
          console.log('up')
          this.zoom = Math.round((this.zoom + Number.EPSILON) * 100) / 100
        }
      }
      if (event.deltaY > 0) {
        if (this.zoom > 1) {
          this.zoom = this.zoom - 0.1
          console.log('ZOOM', this.zoom)
          console.log('down')
          this.zoom = Math.round((this.zoom + Number.EPSILON) * 100) / 100
        }
      }
    }

    console.log('WHEEL', event)
    /*    let scale = this.scale - $event.deltaY * this.scaleFactor;
        scale = clamp(scale, 1, this.zoomThreshold);
        this.calculatePinch(scale);*/
  }

  ngOnInit(): void {
    this.panels$ = this.panelsEntity.entities$
    const id: string = uuid()
    console.log('Your UUID is: ', id)
    const guid = Guid.create()
    console.log('Your GUID is: ', guid)

    this.projects.getDataByProjectId(3).then(async () => {})
    this.store$ = combineLatest([
      this.store.select(selectProjectByRouteParams),
      this.store.select(
        selectInvertersByProjectId({
          projectId: 3,
        }),
      ),
      this.store.select(
        selectTrackersByProjectId({
          projectId: 3,
        }),
      ),
      this.store.select(
        selectStringsByProjectId({
          projectId: 3,
        }),
      ),
      this.store.select(
        selectPanelsByProjectId({
          projectId: 3,
        }),
      ),
    ]).pipe(
      map(([project, inverters, trackers, strings, panels]) => ({
        project,
        inverters,
        trackers,
        strings,
        panels,
      })),
    )
    /*    this.gridState$ = combineLatest([
          this.store.select(selectSelectedStringId),
        ]).pipe(
          map(([selectedStringId]) => ({
            selectedStringId,
          })),
        )*/
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault()

    this.menuTopLeftPosition.x = event.clientX + 'px'
    // console.log(this.menuTopLeftPosition.x)
    this.menuTopLeftPosition.y = event.clientY + 'px'
    // console.log(this.menuTopLeftPosition.y)

    this.matMenuTrigger.openMenu()
  }

  onRouteToInverter(inverter: InverterModel) {}

  click() {
    // console.log('click')
  }

  toggleInverter(inverter: InverterModel, index: number) {
    this.inverterBool[index] = !this.inverterBool[index]
    // console.log(this.inverterBool[index])
  }

  toggleTracker(tracker: TrackerModel, index: number) {
    this.trackerBool[index] = !this.trackerBool[index]
    // console.log(this.trackerBool[index])
  }

  toggleString(stringModel: StringModel, index: number) {
    this.stringBool[index] = !this.stringBool[index]
    // console.log(this.stringBool[index])
  }

  updateView(event: InverterModel) {
    // console.log(event)
    this.view = event
  }

  onZoomChange(event: any) {
    console.log('HELLO', event)
    // const mouse: WheelEvent = event
    if (event.ctrlKey) {
      if (event.wheelDelta > 0) {
        console.log(event.wheelDelta)
      }
      if (event.wheelDelta < 0) {
        console.log(event.wheelDelta)
      }
    }
    this.zoom = event.zoom
  }
}
