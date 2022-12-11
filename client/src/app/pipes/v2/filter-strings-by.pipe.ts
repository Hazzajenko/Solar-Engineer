import { Pipe, PipeTransform } from '@angular/core'
import { StringModel } from '../../projects/models/string.model'
import { TypeModel } from '../../projects/models/type.model'

@Pipe({
  name: 'filterStringsBy',
  standalone: true,
})
export class FilterStringsByPipe implements PipeTransform {
  transform(strings: StringModel[], id: string, model: TypeModel): StringModel[] {
    if (!strings || !id || !model) {
      return strings
    }

    switch (model) {
      case 1:
        return strings.filter((string) => string.inverterId === id)
      case 2:
        return strings.filter((string) => string.trackerId === id)
      default:
        return strings
    }
  }
}
