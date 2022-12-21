import { Pipe, PipeTransform } from '@angular/core'
import { TypeModel } from '../../models/type.model'
import { BlockModel } from '../../models/block.model'

@Pipe({
  name: 'filterBlocksBy',
  standalone: true,
})
export class FilterBlocksByPipe implements PipeTransform {
  transform(blocks: BlockModel[], id: number, unitModel: TypeModel): BlockModel[] {
    if (!blocks || !id || !unitModel) {
      return blocks
    }

    switch (unitModel) {
      case TypeModel.PROJECT:
        return blocks.filter((block) => block.projectId === id)
      default:
        return blocks
    }
  }
}
