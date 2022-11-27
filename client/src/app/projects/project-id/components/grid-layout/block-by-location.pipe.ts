import { Pipe, PipeTransform } from '@angular/core'
import { BlockModel } from '../../../models/block.model'

@Pipe({
  name: 'blockByLocation',
  standalone: true,
})
export class BlockByLocationPipe implements PipeTransform {
  constructor() {}

  transform(blocks: BlockModel[], location: string) {
    return blocks.find((block) => block.location === location)
  }
}
