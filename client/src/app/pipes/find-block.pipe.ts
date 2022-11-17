import { Pipe, PipeTransform } from '@angular/core'
import { BlockModel } from '../projects/models/block.model'

@Pipe({
  name: 'findBlock',
  standalone: true,
})
export class FindBlockPipe implements PipeTransform {
  transform(blocks: BlockModel[], location: string): BlockModel | undefined {
    if (!blocks || !location) {
      return undefined
      // return panels
    }

    return blocks.find((block) => block.id === location)
  }
}
