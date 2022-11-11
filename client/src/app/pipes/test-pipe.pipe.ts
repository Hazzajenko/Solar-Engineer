import { Pipe, PipeTransform } from '@angular/core';
import { StringModel } from '../projects/models/string.model';

@Pipe({
  name: 'testPipe',
})
export class TestPipePipe implements PipeTransform {
  transform(strings: StringModel[], trackerId: number): any {
    if (!strings || !trackerId) {
      return strings;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return strings.filter((stringModel) => stringModel.trackerId === trackerId);
  }
}
