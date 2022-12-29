import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { BlocksFacade } from '@project-id/data-access/store'
import { BlockModel } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'
import { DropRepository } from './drop.repository'
import { DropEventReturn } from './utils/drop.event'

@Injectable({
  providedIn: 'root',
})
export class DropService {
  private blocksFacade = inject(BlocksFacade)
  private dropRepository = inject(DropRepository)

  async drop(drop: CdkDragDrop<BlockModel[]>): Promise<DropEventReturn> {
    drop.event.preventDefault()
    drop.event.stopPropagation()
    const existingBlock = await firstValueFrom(this.blocksFacade.blockByLocation(drop.container.id))
    if (existingBlock) {
      return new DropEventReturn({action: 'BLOCK_TAKEN', result: false, error: 'drop, existingBlock'})
    }
    const block: BlockModel = drop.item.data
    const location: string = drop.container.id
    return this.dropRepository.blockTypeSwitch(block, location)
  }
}
