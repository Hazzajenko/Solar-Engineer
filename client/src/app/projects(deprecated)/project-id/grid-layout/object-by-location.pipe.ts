import { Pipe, PipeTransform } from '@angular/core'
import { BlockModel } from '../../models/block.model'

@Pipe({
  name: 'objectByLocation',
  standalone: true,
})
export class ObjectByLocationPipe implements PipeTransform {
  constructor() {}

  transform(blocks: BlockModel[], location: string) {
    return blocks.find((block) => block.location === location)
  }
}
