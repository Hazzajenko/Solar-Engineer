import { Pipe, PipeTransform } from '@angular/core'
import { GroupChatReadTime } from '@shared/data-access/models'

@Pipe({
  name: 'excludeUserFromSeen',
  standalone: true,
})
export class ExcludeUserFromSeenPipe implements PipeTransform {
  transform(
    readTimes: GroupChatReadTime[] | undefined | null,
    userName: string,
    senderUserName: string,
  ) {
    if (!readTimes) return
    if (!userName) return

    const array = [...readTimes]
    const index = array.map((time) => time.recipientDisplayName).indexOf(userName)
    if (index > -1) {
      array.splice(index, 1)
    }
    const senderIndex = array.map((time) => time.recipientDisplayName).indexOf(senderUserName)
    if (senderIndex > -1) {
      array.splice(senderIndex, 1)
    }

    return array
  }
}
