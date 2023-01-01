import { PanelFactory } from '@grid-layout/data-access/utils';
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { GridEventFactory } from '@grid-layout/data-access/utils'
import { Update } from '@ngrx/entity'
import { BlocksFacade } from '@project-id/data-access/facades'
import { BlockModel, BlockType, PanelModel } from '@shared/data-access/models'
import { match } from 'ts-pattern'


@Injectable({
  providedIn: 'root',
})
export class DropService {
  private result = new GridEventFactory()
  private blocksFacade = inject(BlocksFacade)
  private panelFactory = inject(PanelFactory)

  async drop(drop: CdkDragDrop<BlockModel[]>): Promise<GridEventResult> {
    drop.event.preventDefault()
    drop.event.stopPropagation()
    const existingBlock = await this.blocksFacade.blockByLocation(drop.container.id)

    if (existingBlock) {
      return this.result.error('drop, existingblock')
      // return this.dropRepository.updateState(this.result.error('drop, existingblock'))
    }
    const block: BlockModel = drop.item.data
    const location: string = drop.container.id
    const result = await this.blockTypeSwitch(block, location)
    return result
    // return this.dropRepository.updateState(result)
  }

  private async blockTypeSwitch(block: BlockModel, location: string): Promise<GridEventResult> {
    return match(block.type)
      .with(BlockType.PANEL, async () => this.panelFactory.update(block.id, {location}))
      // .with(BlockType.PANEL, async () => this.updatePanel(block, location))
      .otherwise(async () => this.result.error('blockTypeSwitch, default'))
  }

/*   private async updatePanel(block: BlockModel, location: string): Promise<GridEventResult> {
    const update: Update<PanelModel> = {
      id: block.id,
      changes: {
        location,
      },
    }

    return this.result.action({ action: 'UPDATE_PANEL', data: { update } })
  } */
}
