import { DatePipe, NgForOf, NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MatListModule } from '@angular/material/list'

import {
  GroupChatMessageMemberModel,
  MessageWebUserModel,
  TypeOfMessage,
} from '@shared/data-access/models'
import { GetCdnUrlStringPipe, PrintSeenTextPipe, TimeDifferenceFromNowPipe } from '@shared/pipes'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { YouOrUserNamePipe } from '../../../../../../../shared/pipes/src/lib/text'

export interface MessageState {
  isSelectedMessage: boolean
  isLastMessage: boolean
}

@Component({
  selector: 'app-message-item-component',
  templateUrl: './message-item.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    MatListModule,
    TimeDifferenceFromNowPipe,
    GetCdnUrlStringPipe,
    MatIconModule,
    MatCardModule,
    DatePipe,
    NgForOf,
    PrintSeenTextPipe,
    YouOrUserNamePipe,
  ],
  standalone: true,
})
export class MessageItemComponent {
  @Input() message!: TypeOfMessage
  @Input() state!: MessageState
  @Input() appUserName!: string
}
