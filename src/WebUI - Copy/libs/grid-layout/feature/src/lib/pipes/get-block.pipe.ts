import { Pipe, PipeTransform } from '@angular/core'
import { BlockModel } from '@shared/data-access/models'

@Pipe({
  name: 'getBlock',
  standalone: true,
})
export class GetBlockPipe implements PipeTransform {
  transform(blocks: BlockModel[], location: string) {
    if (!blocks) return
    // const block = blocks.find((block) => block.location === location)
    // if (!block) return
    // return { blockId: block.id, blockType: block.type }
    return blocks.find((block) => block.location === location)
  }
}
