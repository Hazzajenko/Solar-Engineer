import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  inject,
  OnInit,
  Output,
} from '@angular/core'
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { Store } from '@ngrx/store'
import { AppState } from '@shared/data-access/store'
import { firstValueFrom, Observable } from 'rxjs'

import { MatMenuModule } from '@angular/material/menu'
import { CommonModule } from '@angular/common'
import { LetModule } from '@ngrx/component'
import { GridDirective } from '@grid-layout/directives'
import { BlockModel, GridMode, ProjectModel } from '@shared/data-access/models'
import {
  MultiActions, selectBlockByLocation, selectBlocksByProjectIdRouteParams,
  SelectedStateActions,
  selectGridMode, selectMultiMode,
  selectProjectByRouteParams,
} from '@grid-layout/data-access/store'
import {
  CreateService,
  DeleteService,
  LinksService,
  MultiCreateService, MultiDeleteService, MultiSelectService,
  UpdateService,
} from '@grid-layout/data-access/api'
import { GetBlockPipe, GetLocationPipe } from '@grid-layout/pipes'
import { BlockSwitchComponent } from '@grid-layout/feature/block-switch'




@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  standalone: true,
  hostDirectives: [GridDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    LetModule,
    MatMenuModule,
    CommonModule,
    GetLocationPipe,
    GetBlockPipe,
    BlockSwitchComponent,
  ],
})
export class GridComponent implements OnInit {
  private store = inject(Store<AppState>)
  private createService = inject(CreateService)
  private deleteService = inject(DeleteService)
  private updateService = inject(UpdateService)
  private multiCreateService = inject(MultiCreateService)
  private multiDeleteService = inject(MultiDeleteService)
  private multiSelectService = inject(MultiSelectService)
  private linksService = inject(LinksService)

  @Output() clickEvent = new EventEmitter<MouseEvent>()
  @Output() altKeyUpEvent = new EventEmitter<KeyboardEvent>()
  @Output() mouseUpEvent = new EventEmitter<MouseEvent>()
  @Output() mouseDownEvent = new EventEmitter<MouseEvent>()
  @Output() mouseMoveEvent = new EventEmitter<MouseEvent>()

  project$!: Observable<ProjectModel | undefined>
  blocks$!: Observable<BlockModel[]>
  rows = 20
  cols = 40

  async cellAction(location: string, event: MouseEvent) {
    if (event.altKey) {
      return
    }
    this.clickEvent.emit(event)

    const gridMode = await firstValueFrom(this.store.select(selectGridMode))
    switch (gridMode) {
      case GridMode.SELECT:
        const block = await firstValueFrom(this.store.select(selectBlockByLocation({ location })))
        if (!block) {
          console.log('dele')
          this.store.dispatch(SelectedStateActions.clearSelectedState())
        }
        break

      case GridMode.CREATE:
        this.createService.createSwitch(location)
        break

      case GridMode.DELETE:
        this.deleteService.deleteSwitch(location)
        break

      case GridMode.LINK:
        this.linksService.linkSwitch(location, event.shiftKey)
        break
      default:
        break
    }
  }

  gridDrop(event: CdkDragDrop<any, any>) {
    this.updateService.gridDrop(event)
  }

  ngOnInit(): void {
    this.project$ = this.store.select(selectProjectByRouteParams)
    this.blocks$ = this.store.select(selectBlocksByProjectIdRouteParams)
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  async mouseDown(event: MouseEvent, location: string) {
    event.preventDefault()
    event.stopPropagation()
    if (event.altKey) {
      this.mouseDownEvent.emit(event)
      const gridMode = await firstValueFrom(this.store.select(selectGridMode))
      switch (gridMode) {
        case GridMode.CREATE:
          this.multiCreateService.multiCreate(location)
          break
        case GridMode.SELECT:
          this.multiSelectService.multiSelect(location)
          break
        case GridMode.DELETE:
          this.multiDeleteService.multiDelete(location)
          break
      }
    }
  }

  async mouseUp(event: MouseEvent, location: string) {
    const multiMode = await firstValueFrom(this.store.select(selectMultiMode))
    if (!multiMode) {
      return
    }
    this.mouseUpEvent.emit(event)
    const gridMode = await firstValueFrom(this.store.select(selectGridMode))
    switch (gridMode) {
      case GridMode.CREATE:
        this.multiCreateService.multiCreate(location)
        break
      case GridMode.SELECT:
        this.multiSelectService.multiSelect(location)
        break
      case GridMode.DELETE:
        this.multiDeleteService.multiDelete(location)
        break
    }
  }

  @HostListener('window:keyup', ['$event'])
  async altKeyup(event: KeyboardEvent) {
    event.preventDefault()
    event.stopPropagation()
    console.log(event)
    if (event.key === 'Alt') {
      this.altKeyUpEvent.emit(event)
      const multiMode = await firstValueFrom(this.store.select(selectMultiMode))
      if (multiMode) {
        this.store.dispatch(MultiActions.clearMultiState())
      }
    }
  }
}
