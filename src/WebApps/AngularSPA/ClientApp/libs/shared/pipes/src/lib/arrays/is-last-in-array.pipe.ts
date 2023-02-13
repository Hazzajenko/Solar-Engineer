import { inject, Pipe, PipeTransform } from '@angular/core'
import { DatePipe } from '@angular/common'

@Pipe({
  name: 'isLastInArray',
  standalone: true,
})
export class IsLastInArrayPipe implements PipeTransform {
  transform(item: { id: number } | undefined | null, arr: { id: number }[]) {
    if (!item) return
    if (!arr) return
    console.log(item, arr)
    return item.id === arr[arr.length - 1].id
  }
}
