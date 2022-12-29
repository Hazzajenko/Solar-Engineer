/* import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  SelectedFacade,
} from '@project-id/data-access/store'
import { BlockModel, BlockType, GridMode, PanelModel } from '@shared/data-access/models'
import { combineLatest, firstValueFrom, of } from 'rxjs'
import { catchError, combineLatestWith, map, switchMap } from 'rxjs/operators'
import { CellAction } from '../../models/cell-action.model'
import { CreateService } from './create/create.service'
import { MultiService } from './multi/multi.service'
import { SelectedService } from './select/select.service'

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private multiFacade = inject(MultiFacade)
  private multiService = inject(MultiService)
  private createService = inject(CreateService)
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private selectedService = inject(SelectedService)

  gridDrop(dropEvent: CdkDragDrop<BlockModel[]>) {
    dropEvent.event.preventDefault()
    dropEvent.event.stopPropagation()
    return of(this.blocksFacade.blockByLocation(dropEvent.container.id)).pipe(
      map((existingBlock) => {
        if (existingBlock) {
          return undefined
        }
        const block: BlockModel = dropEvent.item.data
        const location: string = dropEvent.container.id
        return this.getUpdateModel(block, location)
      }),
    )
  }

  cellAction(action: CellAction) {
    if (action.event.altKey) {
      return of(undefined)
    }
    return combineLatest([
      this.gridFacade.gridState$,
      this.blocksFacade.blockByLocation(action.location),
    ]).pipe(
      switchMap(([gridState, existingBlock]) => {
        if (existingBlock) {
          return this.selectedService.existingBlock(existingBlock)
        }
        switch (gridState.gridMode) {
          case GridMode.SELECT:
            return this.selectedService.selectEvent()
          case GridMode.CREATE:
            return this.createService.createSwitch(action.location, gridState)
          default:
            return of(undefined)
        }
      }),
    )
  }

  mouseEvent(action: CellAction) {
    if (!action.event.altKey) {
      return of(undefined)
    }
    return combineLatest([this.gridFacade.gridState$, this.multiFacade.state$]).pipe(
      switchMap(([gridState, multiState]) => {
        switch (gridState.gridMode) {
          case GridMode.SELECT:
            return of(undefined)
          // return this.multiService.multiSelect(action.location, multiState)
          case GridMode.CREATE:
            return of(undefined)
          // return this.multiService.multiCreate(action.location, multiState)
          default:
            return of(undefined)
        }
      }),
      catchError((err) => {
        console.error(err)
        return of(undefined)
      }),
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
 */
