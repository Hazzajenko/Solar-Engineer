import { Pipe, PipeTransform } from '@angular/core'
import { MessageModel } from '@shared/data-access/models'

@Pipe({
  name: 'lastMessageId',
  standalone: true,
})
export class LastMessageIdPipe implements PipeTransform {
  transform(messages: MessageModel[] | undefined | null) {
    if (!messages) return

    const inOrder = messages.sort((a: MessageModel, b: MessageModel) => {
      return new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime()
    })

    // console.log(inOrder[0])
    
    return inOrder[0].id
  }
}
