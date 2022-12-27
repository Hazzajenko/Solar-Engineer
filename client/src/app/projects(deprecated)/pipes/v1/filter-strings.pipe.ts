import { Pipe, PipeTransform } from '@angular/core'
import { StringModel } from '../../models/string.model'

@Pipe({
  name: 'filterStrings',
  standalone: true,
})
export class FilterStringsPipe implements PipeTransform {
  transform(strings: StringModel[], trackerId: string): StringModel[] {
    if (!strings || !trackerId) {
      return strings
    }

    return strings.filter((stringModel) => stringModel.trackerId === trackerId)
  }
}