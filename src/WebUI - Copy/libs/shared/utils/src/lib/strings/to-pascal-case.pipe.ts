import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'toPascalCase',
  standalone: true,
})
export class ToPascalCasePipe implements PipeTransform {

  transform(value: string) {
    return value.replace(
      /\w+/g,
      function(w) {
        return w[0].toUpperCase() + w.slice(1).toLowerCase()
      },
    )
  }
}
