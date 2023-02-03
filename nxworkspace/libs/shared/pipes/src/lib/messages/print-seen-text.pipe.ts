import { Pipe, PipeTransform } from '@angular/core'
import { GroupChatMessageMemberModel, MessageFrom } from '@shared/data-access/models'

@Pipe({
  name: 'printSeenText',
  standalone: true,
})
export class PrintSeenTextPipe implements PipeTransform {
  transform(message: GroupChatMessageMemberModel | undefined | null, appUserName: string) {
    if (!message) return
    const request = { ...message }

    const readTimes = request.messageReadTimes

    const senderIndex = readTimes
      .map((time) => time.recipientUserName)
      .indexOf(request.senderUserName)
    if (senderIndex > -1) {
      readTimes.splice(senderIndex, 1)
    }

    return readTimes.map((time) => {
      // const isUserReader = time.recipientUserName === appUserName

      const isUserReader = time.recipientUserName === appUserName
      const user = isUserReader ? 'you' : time.recipientUserName
      const isLast = time.id === readTimes[readTimes.length - 1].id
      const comma = isLast ? '' : ', '
      return `${user}${comma}`
    })
  }
}

//
// {{ readTime.recipientUserName | youOrUserName: user.userName }}
// <ng-container *ngIf="state.isSelectedMessage">
//   {{ readTime.messageReadTime | date: "short" }}
// </ng-container>
// {{ (readTime | isLastInArray: message.messageReadTimes) ? "" : "," }}
