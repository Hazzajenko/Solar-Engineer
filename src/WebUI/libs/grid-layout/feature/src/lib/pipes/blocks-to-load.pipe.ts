import { inject, Pipe, PipeTransform } from '@angular/core'
import { BlockModel } from '@shared/data-access/models'
import { GridLayoutService } from '../grid-layout.service'

@Pipe({
  name: 'blocksToLoad',
  standalone: true,
})
export class BlocksToLoadPipe implements PipeTransform {
  private gridLayoutService = inject(GridLayoutService)

  transform(blocks: BlockModel[], location: string) {
    if (!blocks) return
    if (this.gridLayoutService.amountOfInitialBlocks === undefined) {
      this.gridLayoutService.amountOfInitialBlocks = blocks.length
    }
    return blocks.find((block) => block.location === location)
  }
}
