import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { BlocksFacade, GridFacade, MultiFacade } from '@project-id/data-access/store'
import { BlockModel, BlockType, GridMode, PanelModel } from '@shared/data-access/models'
import { combineLatest, of } from 'rxjs'
import { catchError, combineLatestWith, map, switchMap } from 'rxjs/operators'
import { CellAction } from '../models/cell-action.model'
import { CreateService } from './create.service'
import { MultiService } from '../multi/multi.service'

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private multiFacade = inject(MultiFacade)
  private multiService = inject(MultiService)
  private createService = inject(CreateService)
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)

  gridDrop(dropEvent: CdkDragDrop<BlockModel[]>) {
    dropEvent.event.preventDefault()
    dropEvent.event.stopPropagation()

    return of(dropEvent).pipe(
      combineLatestWith(this.blocksFacade.blockByLocation(dropEvent.container.id)),
      map(([event, existingBlock]) => {
        if (existingBlock) {
          return undefined
        }
        const block: BlockModel = event.item.data
        const location: string = event.container.id
        return this.getUpdateModel(block, location)
      }),
    )
  }

  cellAction(action: CellAction) {
    if (action.event.altKey) {
      return of(undefined)
    }
    return combineLatest([of(action), this.gridFacade.gridState$]).pipe(
      switchMap(([action, gridState]) => {
        if (!action) return of(undefined)
        switch (gridState.gridMode) {
          case GridMode.SELECT:
            return this.createService.createSwitch(action.location, gridState)
          case GridMode.CREATE:
            return this.createService.createSwitch(action.location, gridState)
          default:
            return of(undefined)
        }
      }),
    )
  }


  mouseEvent(action: CellAction) {
    return of(action).pipe(
      map((action) => {
        if (!action.event.altKey) {
          return undefined
        }
        return action
      }),
      switchMap((action) =>
        combineLatest([of(action), this.gridFacade.gridState$, this.multiFacade.state$]),
      ),
      switchMap(([action, gridState, multiState]) => {
        if (!action) return of(undefined)
        switch (gridState.gridMode) {
          case GridMode.SELECT:
            return this.multiService.multiSelect(action.location, multiState)
          case GridMode.CREATE:
            return this.multiService.multiCreate(action.location, multiState)
          default:
            return of(undefined)
        }
      }),
      catchError(err => {
        console.error(err)
        return of(undefined)
      })
    )
  }

  private getUpdateModel(block: BlockModel, location: string) {
    switch (block.type) {
      case BlockType.PANEL: {
        const panel: Update<PanelModel> = {
          id: block.id,
          changes: {
            location,
          },
        }
        return panel
      }
      default:
        return undefined
    }
  }
}
