import { Pipe, PipeTransform } from '@angular/core'
import {
  CombinedMessageUserModel,
  GroupChatMessageMemberModel,
  MessageFrom,
  TypeOfMessage,
} from '@shared/data-access/models'

@Pipe({
  name: 'printSeenText',
  standalone: true,
})
export class PrintSeenTextPipe implements PipeTransform {
  transform(message: TypeOfMessage | undefined | null, appUserName: string) {
    if (!message) return [''] as string[]

    if (message.messageReadTimes.length < 1) {
      return [''] as string[]
    }

    const request = { ...message }

    const readTimes = request.messageReadTimes

    const senderIndex = readTimes
      .map((time) => time.recipientDisplayName)
      .indexOf(request.senderDisplayName)
    if (senderIndex > -1) {
      readTimes.splice(senderIndex, 1)
    }

    const result = readTimes.map((time) => {
      // const isUserReader = time.recipientUserName === appUserName

      const isUserReader = time.recipientDisplayName === appUserName
      const user = isUserReader ? 'you' : time.recipientDisplayName
      const isLast = time.id === readTimes[readTimes.length - 1].id
      const comma = isLast ? '' : ', '
      return `${user}${comma}`
    })
    result.unshift('Seen by ')
    return result
  }
}

//
// {{ readTime.recipientUserName | youOrUserName: user.userName }}
// <ng-container *ngIf="state.isSelectedMessage">
//   {{ readTime.messageReadTime | date: "short" }}
// </ng-container>
// {{ (readTime | isLastInArray: message.messageReadTimes) ? "" : "," }}
