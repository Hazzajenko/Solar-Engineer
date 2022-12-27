import {
  catchError,
  combineLatestWith,
  distinctUntilChanged,
  exhaustMap,
  map,
} from 'rxjs/operators'
import { MultiFacade } from '@project-id/data-access/store'

import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { BlocksFacade, GridFacade, PanelsFacade } from '@project-id/data-access/store'
import { BlockModel, BlockType } from '@shared/data-access/models'
import { combineLatest, Observable, of, tap } from 'rxjs'
import { CellAction } from '../models/cell-action.model'
import { MultiEventType } from '../multi/multi.event'
import { GridService } from '../services/grid.service'
import { ClientXY } from '../models/client-x-y.model'
interface GridState {
  isDragging: boolean
  startX?: number
  startY?: number
}

@Injectable({
  providedIn: 'root',
})
export class GridStore extends ComponentStore<GridState> {
  isDragging$ = this.select((state) => state.isDragging)
  startX$ = this.select((state) => state.startX)
  startY$ = this.select((state) => state.startY)
  coords$: Observable<ClientXY> = combineLatest([this.startX$, this.startY$]).pipe(
    map(([startX, startY]) => {
      return {
        startX,
        startY
      } as ClientXY
    })
  )

  private blocksFacade = inject(BlocksFacade)
  private panelsFacade = inject(PanelsFacade)
  private gridService = inject(GridService)
  private gridFacade = inject(GridFacade)
  private multiFacade = inject(MultiFacade)

  readonly cellAction = this.effect((action$: Observable<CellAction>) =>
    action$.pipe(
      tap((action) => {
        action.event.preventDefault()
        action.event.stopPropagation()
      }),
      exhaustMap((action) =>
        this.gridService.cellAction(action).pipe(
          tap((res) => {
            if (res) {
              console.log(res)
              this.panelsFacade.createPanel(res)
            }
          }),
        ),
      ),
    ),
  )

  readonly gridDrop = this.effect((drop$: Observable<CdkDragDrop<BlockModel[]>>) =>
    drop$.pipe(
      tap((drop) => {
        drop.event.preventDefault()
        drop.event.stopPropagation()
      }),
      exhaustMap((drop) =>
        this.gridService.gridDrop(drop).pipe(
          tap((update) => {
            if (!update) return
            return this.panelsFacade.updatePanel(update)
          }),
        ),
      ),
    ),
  )

  readonly keyUp = this.effect((event$: Observable<KeyboardEvent>) =>
    event$.pipe(
      tap((event) => {
        event.preventDefault()
        event.stopPropagation()
      }),
      distinctUntilChanged(),
      combineLatestWith(this.multiFacade.state$),
      tap(([event, multiState]) => {
        console.log('hii')
        if (multiState.locationStart && event.key === 'Alt') {
          console.log('hii')
          this.multiFacade.clearMultiState()
        }
      }),
    ),
  )

  readonly mouseEvent = this.effect((action$: Observable<CellAction>) =>
    action$.pipe(
      distinctUntilChanged(),
      combineLatestWith(this.multiFacade.state$),
      map(([action, multiState]) => {
        if (!action.event.altKey) return undefined
        if (action.event.type === 'mousedown' && multiState.locationStart) {
          return undefined
        }
        if (action.event.type === 'mouseup' && !multiState.locationStart) {
          return undefined
        }
        return action
      }),
      tap((action) => {
        if (action) {
          if (action.event.type === 'mousedown') {
            this.patchState({
              startX: action.event.clientX,
              startY: action.event.clientY,
            })
          }
          if (action.event.type === 'mouseup') {
            this.patchState({
              startX: undefined,
              startY: undefined,
            })
          }
        }
      }),
      exhaustMap((action) => {
        if (!action) return of(undefined)
        return this.gridService.mouseEvent(action).pipe(
          tap((res) => {
            if (res) {
              switch (res[0]) {
                case MultiEventType.SelectStart:
                  this.multiFacade.startMultiSelect(res[1].location)
                  break
                case MultiEventType.SelectFinish:
                  this.multiFacade.finishMultiSelect(res[1].location, res[1].ids)
                  break
                case MultiEventType.CreateStartPanel:
                  this.multiFacade.startMultiCreate(res[1].location, BlockType.PANEL)
                  break
                case MultiEventType.CreateFinishPanel:
                  this.multiFacade.finishMultiCreatePanels(
                    res[1].location,
                    BlockType.PANEL,
                    res[1].panels,
                  )
                  break
              }
            }
          }),
        )
      }),
      catchError((err) => {
        console.error(err)
        return of(undefined)
      }),
    ),
  )
  constructor() {
    super({
      isDragging: false,
    })
  }
}
