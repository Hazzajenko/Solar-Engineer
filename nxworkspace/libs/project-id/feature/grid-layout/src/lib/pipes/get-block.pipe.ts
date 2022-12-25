import { Pipe, PipeTransform } from '@angular/core'
import { BlockModel } from '@shared/data-access/models'

@Pipe({
  name: 'getBlock',
  standalone: true,
})
export class GetBlockPipe implements PipeTransform {
  transform(blocks: BlockModel[], location: string) {
    if(!blocks) return
    return blocks.find((block) => block.location === location)
  }
}
