import { Pipe, PipeTransform } from '@angular/core'
import { GroupChatMessageModel, GroupChatReadTime, MessageModel } from '@shared/data-access/models'

@Pipe({
  name: 'anyGroupMessageSeen',
  standalone: true,
})
export class AnyGroupMessageSeenPipe implements PipeTransform {
  transform(readTimes: GroupChatReadTime[] | undefined | null, userName: string) {
    if (!readTimes) return
    if (!userName) return

    const array = [...readTimes]
    if (array.length < 1) {
      return false
    }
    return array.length > 0
    /*    const index.ts = array.map((time) => time.recipientUserName).indexOf(userName)

        return index.ts <= -1*/
  }
}
