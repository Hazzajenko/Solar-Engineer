import { ClientXY } from '../models/client-x-y.model'

import { MultiFacade } from '@project-id/data-access/store'
import { catchError, combineLatestWith, distinctUntilChanged, map, switchMap } from 'rxjs/operators'

import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { BlocksFacade, GridFacade, PanelsFacade } from '@project-id/data-access/store'
import { BlockModel, BlockType } from '@shared/data-access/models'
import { Observable, of, tap } from 'rxjs'
import { CellAction } from '../models/cell-action.model'
import { MouseEventAction } from '../services/mouse/utils/events/mouse.event'
import { GridService } from '../services/deprecated/grid.service'

interface GridState {
  clientXY: ClientXY
}

const initialGridState = {
  clientXY: {
    clientX: undefined,
    clientY: undefined,
  },
}

@Injectable({
  providedIn: 'root',
})
export class GridStore extends ComponentStore<GridState> {
  clientXY$: Observable<ClientXY> = this.select((state) => state.clientXY)

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
      switchMap((action) =>
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
      switchMap((drop) =>
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
        if (multiState.locationStart && event.key === 'Alt') {
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
              clientXY: {
                clientX: action.event.clientX,
                clientY: action.event.clientY,
              },
            })
          }
          if (action.event.type === 'mouseup') {
            this.patchState({
              clientXY: {
                clientX: undefined,
                clientY: undefined,
              },
            })
          }
        }
      }),
      switchMap((action) => {
        if (!action) return of(undefined)
        return this.gridService.mouseEvent(action).pipe(
          tap((res) => {
            if (res) {
              switch (res[0]) {
                case MouseEventAction.SelectStart:
                  this.multiFacade.startMultiSelect(res[1].location)
                  break
                case MouseEventAction.SelectFinish:
                  this.multiFacade.finishMultiSelect(res[1].location, res[1].ids)
                  break
                case MouseEventAction.CreateStartPanel:
                  this.multiFacade.startMultiCreate(res[1].location, BlockType.PANEL)
                  break
                case MouseEventAction.CreateFinishPanel:
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
    super(initialGridState)
  }
}
