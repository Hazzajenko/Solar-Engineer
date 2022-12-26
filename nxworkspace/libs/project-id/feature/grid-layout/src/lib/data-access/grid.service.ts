import { map, combineLatestWith, switchMap, catchError } from 'rxjs/operators'
import { of, throwError, EMPTY, from, defer, combineLatest } from 'rxjs'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { BlocksFacade, GridState, PanelsFacade } from '@project-id/data-access/store'
import { BlockModel, BlockType, GridMode, PanelModel } from '@shared/data-access/models'
import { CellAction } from './cell-action.model'
import { CreateService } from './create.service'

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private panelsFacade = inject(PanelsFacade)
  private createService = inject(CreateService)
  private blocksFacade = inject(BlocksFacade)

  gridDrop(event: CdkDragDrop<BlockModel[]>, existingBlock: BlockModel | undefined) {
    event.event.preventDefault()
    event.event.stopPropagation()
    console.log(existingBlock)
    console.log(event)
    if (existingBlock) {
      return console.warn(`block already exists as ${event.container.id}`)
    }

    const block: BlockModel = event.item.data
    const location = event.container.id

    switch (block.type) {
      case BlockType.PANEL: {
        const panel: Update<PanelModel> = {
          id: block.id,
          changes: {
            location,
          },
        }
        return this.panelsFacade.updatePanel(panel)
      }

      default:
        break
    }
  }

  gridDropV2(dropEvent: CdkDragDrop<BlockModel[]>) {
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

  cellActionV2(action: CellAction, gridState: GridState) {
    return combineLatest(
      [of(action),
        of(gridState)]
    ).pipe(
      map(([action, gridState]) => {
        if (action.event.altKey) {
          return undefined
        }
        return {action, gridState}
      }),
      switchMap((res) => {
        if (!res) return of(undefined)
        
      }
    )

  }

  async cellAction(action: CellAction, gridState: GridState) {
    if (action.event.altKey) {
      return
    }
    // this.clickEvent.emit(event)

    switch (gridState.gridMode) {
      case GridMode.SELECT:
        // const block = await firstValueFrom(this.store.select(selectBlockByLocation({ location })))
        // if (!block) {
        //   console.log('dele')
        //   this.store.dispatch(SelectedStateActions.clearSelectedState())
        // }
        break

      case GridMode.CREATE:
        // this.createService.createSwitch(location)
        break

      case GridMode.DELETE:
        // this.deleteService.deleteSwitch(location)
        break

      case GridMode.LINK:
        // this.joinsService.linkSwitch(location, event.shiftKey)
        break
      default:
        break
    }
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
