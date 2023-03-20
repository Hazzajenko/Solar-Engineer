import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'createRange',
  standalone: true,
})
export class CreateRangePipe implements PipeTransform {
  transform(value: number) {
    return new Array(value).fill(0).map((n, index) => index + 1)
  }
}
