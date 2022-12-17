import { Pipe, PipeTransform } from '@angular/core'
import { BlockModel } from '../../../../../libs/shared/data-access/models/src/lib/block.model'

@Pipe({
  name: 'findBlockNumber',
  standalone: true,
})
export class FindBlockNumberPipe implements PipeTransform {
  transform(blocks: BlockModel[], location: string): BlockModel | undefined {
    if (!blocks || !location) {
      return undefined
      // return panels
    }

    return blocks.find((block) => block.location === location)
  }
}
