import { Pipe, PipeTransform } from '@angular/core'
import { MessageModel } from '@shared/data-access/models'

@Pipe({
  name: 'sortConversationMessages',
  standalone: true,
})
export class SortConversationMessagesPipe implements PipeTransform {
  transform(messages: MessageModel[] | undefined | null) {
    if (!messages) return

    const response: MessageModel[] = [...messages]

    return response.sort((a: MessageModel, b: MessageModel) => {
      return new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime()
    })
  }
}
