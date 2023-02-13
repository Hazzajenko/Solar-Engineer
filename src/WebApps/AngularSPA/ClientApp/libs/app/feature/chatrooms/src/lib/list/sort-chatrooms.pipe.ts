import { Pipe, PipeTransform } from '@angular/core'
import { MessageTimeSortModel } from '@shared/data-access/models'

@Pipe({
  name: 'sortChatrooms',
  standalone: true,
})
export class SortChatroomsPipe implements PipeTransform {
  transform(messages: MessageTimeSortModel[] | undefined | null) {
    if (!messages) return

    // const array = [...messages]


    return [...messages].sort((a: MessageTimeSortModel, b: MessageTimeSortModel) => {
      return (
        new Date(b.latestSentMessageTime).getTime() - new Date(a.latestSentMessageTime).getTime()
      )
    })
  }
}
