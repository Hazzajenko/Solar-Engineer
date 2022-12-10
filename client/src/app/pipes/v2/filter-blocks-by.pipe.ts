import { Pipe, PipeTransform } from '@angular/core'
import { UnitModel } from '../../projects/models/unit.model'
import { BlockModel } from '../../projects/models/block.model'

@Pipe({
  name: 'filterBlocksBy',
  standalone: true,
})
export class FilterBlocksByPipe implements PipeTransform {
  transform(blocks: BlockModel[], id: number, unitModel: UnitModel): BlockModel[] {
    if (!blocks || !id || !unitModel) {
      return blocks
    }

    switch (unitModel) {
      case UnitModel.PROJECT:
        return blocks.filter((block) => block.projectId === id)
      default:
        return blocks
    }
  }
}
