import { Pipe, PipeTransform } from '@angular/core'
import { GroupChatMessageModel, MessageModel } from '@shared/data-access/models'

@Pipe({
  name: 'lastGroupChatMessageId',
  standalone: true,
})
export class LastGroupChatMessageIdPipe implements PipeTransform {
  transform(messages: GroupChatMessageModel[] | undefined | null) {
    if (!messages) return

    const array = [...messages]

    const inOrder = array.sort((a: GroupChatMessageModel, b: GroupChatMessageModel) => {
      return new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime()
    })

    console.log(inOrder[0])
    return inOrder[0].id
  }
}
