import { BlocksActions } from './../../../../../data-access/store/src/lib/blocks/blocks.actions'
import { catchError, combineLatestWith, retry, share } from 'rxjs/operators'

import { BlockModel } from '@shared/data-access/models'
import { GridService } from './grid.service'
import { BlocksFacade, GridFacade, PanelsFacade } from '@project-id/data-access/store'
import { ComponentStore } from '@ngrx/component-store'
import { inject, Injectable } from '@angular/core'
import { EMPTY, Observable, of, switchMap, tap } from 'rxjs'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { CellAction } from './cell-action.model'

interface GridState {
  isDragging: boolean
}

@Injectable({
  providedIn: 'root',
})
export class GridStore extends ComponentStore<GridState> {
  isDragging$ = this.select((state) => state.isDragging)

  mouseDown = this.updater((state) => ({
    ...state,
    isDragging: true,
  }))

  mouseUp = this.updater((state) => ({
    ...state,
    isDragging: false,
  }))

  private blocksFacade = inject(BlocksFacade)
  private panelsFacade = inject(PanelsFacade)
  private gridService = inject(GridService)
  private gridFacade = inject(GridFacade)

  readonly gridDrop = this.effect((drop$: Observable<CdkDragDrop<BlockModel[]>>) =>
    drop$.pipe(
      switchMap((drop) =>
        this.blocksFacade
          .blockByLocation(drop.container.id)
          .pipe(tap((existingBlock) => this.gridService.gridDrop(drop, existingBlock))),
      ),
    ),
  )

  readonly cellAction = this.effect((action$: Observable<CellAction>) =>
    action$.pipe(
      switchMap((action) =>
        this.gridFacade.gridState$.pipe(
          tap((gridState) => this.gridService.cellAction(action, gridState)),
        ),
      ),
    ),
  )

  readonly gridDropV2 = this.effect((drop$: Observable<CdkDragDrop<BlockModel[]>>) =>
    drop$.pipe(
      tap(drop => {
        drop.event.preventDefault()
        drop.event.stopPropagation()
      }),
      switchMap((drop) =>
        this.gridService.gridDropV2(drop).pipe(
          tap((update) => {
            if (!update) return
            return this.panelsFacade.updatePanel(update)
          }),
        ),
      ),
    ),
  )

  constructor() {
    super({
      isDragging: false,
    })
  }
}
