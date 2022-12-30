import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { BlocksFacade } from '@project-id/data-access/store'
import { BlockModel, BlockType, PanelModel } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'
import { match } from 'ts-pattern'
import { DropEventReturnType } from '../utils/events/drop.event'
import { GridEventFactory, GridEventResult } from '../utils/grid.factory'
import { DropEventResult } from './drop.factory'

import { DropRepository } from './drop.repository'

@Injectable({
  providedIn: 'root',
})
export class DropService {
  private result = new GridEventFactory().dropEvents()
  private blocksFacade = inject(BlocksFacade)
  private dropRepository = inject(DropRepository)

  async drop(drop: CdkDragDrop<BlockModel[]>): Promise<GridEventResult> {
    drop.event.preventDefault()
    drop.event.stopPropagation()
    const existingBlock = await this.blocksFacade.blockByLocation(drop.container.id)

    /*     const existingBlock = await firstValueFrom(
      this.blocksFacade.blockByLocation$(drop.container.id),
    ) */
    if (existingBlock) {
      return this.result.error('drop, existingblock')
      /*       return new DropEventReturn({
        action: 'BLOCK_TAKEN',
        result: false,
        error: 'drop, existingBlock',
      }) */
    }
    const block: BlockModel = drop.item.data
    const location: string = drop.container.id
    return this.blockTypeSwitch(block, location)
  }

  private async blockTypeSwitch(block: BlockModel, location: string): Promise<GridEventResult> {
    return await match(block.type)
      .with(BlockType.PANEL, async () => this.updatePanel(block, location))
      .otherwise(async () => this.result.error('blockTypeSwitch, default'))
    /*     switch (block.type) {
      case BlockType.PANEL: {
        const update: Update<PanelModel> = {
          id: block.id,
          changes: {
            location,
          },
        }
        // this.panelsFacade.updatePanel(update)
        return this.result.action({ action: 'UPDATE_PANEL', data: { update } })
        // return this.result.action('UPDATE_PANEL')
        // return new DropEventReturn({ action: 'UPDATE_PANEL', result: true })
      }
      default:
        return this.result.error('blockTypeSwitch, default')
      // return new DropEventReturn({ action: 'UNDEFINED', result: false, error: 'drop, default' })
    } */
  }

  private async updatePanel(block: BlockModel, location: string): Promise<GridEventResult> {
    const update: Update<PanelModel> = {
      id: block.id,
      changes: {
        location,
      },
    }
    // this.panelsFacade.updatePanel(update)
    return this.result.action({ action: 'UPDATE_PANEL', data: { update } })
  }
}
