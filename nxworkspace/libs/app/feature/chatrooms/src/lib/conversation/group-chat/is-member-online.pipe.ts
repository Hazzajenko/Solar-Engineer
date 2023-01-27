import { Pipe, PipeTransform } from '@angular/core'
import { GroupChatMemberModel } from '@shared/data-access/models'

@Pipe({
  name: 'isMemberOnline',
  standalone: true,
})
export class IsMemberOnlinePipe implements PipeTransform {
  transform(memberUsername: string | undefined | null, onlineMembers: GroupChatMemberModel[]) {
    if (!memberUsername) return
    if (!onlineMembers) return

    return onlineMembers.find((member) => member.userName === memberUsername)?.isOnline
  }
}
