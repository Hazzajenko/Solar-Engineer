import { Pipe, PipeTransform } from '@angular/core'
import { MessageModel } from '@shared/data-access/models'

@Pipe({
  name: 'sortMessages',
  standalone: true,
})
export class SortMessagesPipe implements PipeTransform {
  transform(messages: MessageModel[] | undefined | null, unreadFilter: boolean) {
    if (!messages) return

    const response: MessageModel[] = [...messages]

    const sortByMessageSent = response.sort((a: MessageModel, b: MessageModel) => {
      return new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime()
    })

    if (!unreadFilter) return sortByMessageSent

    const next = [...sortByMessageSent]
    return next
    /*
        const result = next.sort((a: MessageModel, b: MessageModel) => {
          return a.status - b.status
        })
        console.log(result)
        return result*/
  }
}
