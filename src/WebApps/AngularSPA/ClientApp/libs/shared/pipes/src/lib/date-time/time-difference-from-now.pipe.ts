import { inject, Pipe, PipeTransform } from '@angular/core'
import { DatePipe } from '@angular/common'

@Pipe({
  name: 'timeDifferenceFromNow',
  standalone: true,
})
export class TimeDifferenceFromNowPipe implements PipeTransform {
  private datePipe = inject(DatePipe)

  transform(dateTime: string | undefined | null) {
    if (!dateTime) return
    const now = Date.now()
    const dateTimeDate = new Date(dateTime).getTime()

    let timeDifference = dateTimeDate - now
    const hours = Math.floor(timeDifference / 1000 / 60 / 60)
    timeDifference -= hours * 1000 * 60 * 60
    const minutes = Math.floor(timeDifference / 1000 / 60)
    // timeDifference -= minutes * 1000 * 60
    const positiveHours = hours * -1

    if (positiveHours > 24) return this.datePipe.transform(dateTime, 'short')

    return `${positiveHours} Hours ${minutes} Minutes Ago`
  }
}
