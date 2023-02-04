import { Pipe, PipeTransform } from '@angular/core'
import {
  CombinedMessageUserModel,
  MessageModel,
  MessageWebUserModel,
} from '@shared/data-access/models'

@Pipe({
  name: 'sortConversationMessages',
  standalone: true,
})
export class SortConversationMessagesPipe implements PipeTransform {
  transform(messages: MessageWebUserModel[] | undefined | null, options?: 'asc' | 'desc') {
    if (!messages) return

    const response: MessageWebUserModel[] = [...messages]

    if (!options || options === 'asc') {
      return response.sort((a: MessageWebUserModel, b: MessageWebUserModel) => {
        return new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime()
      })
    }
    if (options !== 'desc') return
    return response.sort((a: MessageWebUserModel, b: MessageWebUserModel) => {
      return new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime()
    })
  }
}
