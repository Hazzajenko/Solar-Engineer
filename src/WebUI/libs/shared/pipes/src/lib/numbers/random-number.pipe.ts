import { Pipe, PipeTransform } from '@angular/core'
import { randomIntFromInterval } from '@shared/utils'

@Pipe({
  name: 'getRandomNumber',
  standalone: true,
})
export class RandomNumberPipe implements PipeTransform {
  transform(numberOne: number | undefined | null, numberTwo: number | undefined | null) {
    if (!numberOne || !numberTwo) return
    return randomIntFromInterval(numberOne, numberTwo)
  }
}
