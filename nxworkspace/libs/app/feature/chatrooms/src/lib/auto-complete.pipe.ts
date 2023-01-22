import { Pipe, PipeTransform } from '@angular/core'
import { MessageModel } from '@shared/data-access/models'

@Pipe({
  name: 'autoComplete',
  standalone: true,
})
export class AutoCompletePipe implements PipeTransform {
  transform(messages: MessageModel[] | undefined | null, message: MessageModel) {
    if (!messages) return

    messages.sort((a: MessageModel, b: MessageModel) => {
      return new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime()
    })

    return messages[0].id === message.id
  }
}
