import { Pipe, PipeTransform } from '@angular/core'
import { GroupChatReadTime } from '@shared/data-access/models'

@Pipe({
  name: 'excludeUserFromSeen',
  standalone: true,
})
export class ExcludeUserFromSeenPipe implements PipeTransform {
  transform(readTimes: GroupChatReadTime[] | undefined | null, username: string) {
    if (!readTimes) return
    if (!username) return

    const array = [...readTimes]

    const index = array.map((time) => time.recipientUsername).indexOf(username)
    if (index > -1) {
      array.splice(index, 1)
    }
    return array
  }
}
