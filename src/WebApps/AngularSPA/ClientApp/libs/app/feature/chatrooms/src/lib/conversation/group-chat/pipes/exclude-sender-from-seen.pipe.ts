import { Pipe, PipeTransform } from '@angular/core'
import { GroupChatReadTime } from '@shared/data-access/models'

@Pipe({
  name: 'excludeSenderFromSeen',
  standalone: true,
})
export class ExcludeSenderFromSeenPipe implements PipeTransform {
  transform(readTimes: GroupChatReadTime[] | undefined | null, senderUserName: string) {
    if (!readTimes) return

    const array = [...readTimes]
    const senderIndex = array.map((time) => time.recipientDisplayName).indexOf(senderUserName)
    if (senderIndex > -1) {
      array.splice(senderIndex, 1)
    }

    console.log(array)

    return array
  }
}
