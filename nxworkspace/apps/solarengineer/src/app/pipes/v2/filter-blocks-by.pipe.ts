import { Pipe, PipeTransform } from '@angular/core'
import { TypeModel } from '../../../../../../libs/shared/data-access/models/src/lib/type.model'
import { BlockModel } from '../../../../../../libs/shared/data-access/models/src/lib/block.model'

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
