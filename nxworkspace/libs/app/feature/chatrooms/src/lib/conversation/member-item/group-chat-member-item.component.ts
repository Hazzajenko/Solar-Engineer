import { NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MatListModule } from '@angular/material/list'

import { GroupChatMemberModel, UserModel, WebUserModel } from '@shared/data-access/models'
import { GetCdnUrlStringPipe, TimeDifferenceFromNowPipe } from '@shared/pipes'

@Component({
  selector: 'app-group-chat-member-item-component',
  templateUrl: './group-chat-member-item.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, MatListModule, TimeDifferenceFromNowPipe, GetCdnUrlStringPipe],
  standalone: true,
})
export class GroupChatMemberItemComponent {
  @Input() member!: GroupChatMemberModel
  @Input() webUser!: WebUserModel
  @Input() user!: UserModel
}
