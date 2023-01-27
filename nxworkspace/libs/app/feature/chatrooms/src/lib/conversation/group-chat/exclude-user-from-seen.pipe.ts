import { Pipe, PipeTransform } from '@angular/core'
import { GroupChatReadTime } from '@shared/data-access/models'

@Pipe({
  name: 'excludeUserFromSeen',
  standalone: true,
})
export class ExcludeUserFromSeenPipe implements PipeTransform {
  transform(readTimes: GroupChatReadTime[] | undefined | null, userName: string) {
    if (!readTimes) return
    if (!userName) return

    const array = [...readTimes]

    const index = array.map((time) => time.recipientUserName).indexOf(userName)
    if (index > -1) {
      array.splice(index, 1)
    }
    return array
  }
}
