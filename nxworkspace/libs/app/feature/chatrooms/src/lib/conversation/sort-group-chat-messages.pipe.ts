import { Pipe, PipeTransform } from '@angular/core'
import { GroupChatMessageModel, MessageModel } from '@shared/data-access/models'

@Pipe({
  name: 'sortGroupChatMessages',
  standalone: true,
})
export class SortGroupChatMessagesPipe implements PipeTransform {
  transform(messages: GroupChatMessageModel[] | undefined | null) {
    if (!messages) return

    const response: GroupChatMessageModel[] = [...messages]

    return response.sort((a: GroupChatMessageModel, b: GroupChatMessageModel) => {
      return new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime()
    })
  }
}
