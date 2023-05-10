import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common'
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule, MatSelectionListChange } from '@angular/material/list'
import { AuthStoreService } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'

import { AuthUserModel, GroupChatMemberModel, WebUserModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { combineLatest, map, Observable, switchMap } from 'rxjs'
import { FriendsStoreService } from '@app/data-access/friends'
import { UsersStoreService } from '@app/data-access/users'
import { GroupChatsStoreService, InviteToGroupChatRequest, MemberInviteModel } from '@app/data-access/group-chats'
import { GroupChatMemberItemComponent } from '../../member-item/group-chat-member-item.component'

@Component({
  selector: 'app-add-group-chat-members-component',
  templateUrl: './add-group-chat-members.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    AsyncPipe,
    NgForOf,
    NgStyle,
    MatListModule,
    ScrollingModule,
    NgIf,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    ShowHideComponent,
    NgClass,
    MatCardModule,
    NgSwitch,
    NgSwitchCase,
    DatePipe,
    MatCheckboxModule,
    LetDirective,
    GroupChatMemberItemComponent,
  ],
  providers: [DatePipe],
  standalone: true,
})
export class AddGroupChatMembersComponent {
  private authStore = inject(AuthStoreService)
  private friendsStore = inject(FriendsStoreService)
  private usersStore = inject(UsersStoreService)
  private groupChatsStore = inject(GroupChatsStoreService)

  user$: Observable<AuthUserModel | undefined> = this.authStore.select.user$
  selectedMembersToInvite: WebUserModel[] = []
  groupChatMembers$: Observable<GroupChatMemberModel[]>
  groupChatId: number
  groupChatName: string

  membersToInvite$: Observable<WebUserModel[]> = this.friendsStore.select.friends$.pipe(
    map((friends) => friends),
    switchMap((friends) =>
      combineLatest(
        friends.map((friend) =>
          this.usersStore.select.webUserCombinedByUserName$(friend.displayName),
        ),
      ),
    ),
    switchMap((users) =>
      this.groupChatsStore.select.groupChatMembersById$(this.groupChatId).pipe(
        map((members) => members.map((member) => member.displayName)),
        map((userNames) => users.filter((user) => !userNames.includes(user.displayName))),
      ),
    ),
  )

  constructor(
    private dialogRef: MatDialogRef<AddGroupChatMembersComponent>,
    @Inject(MAT_DIALOG_DATA) data: { groupChatName: string; groupChatId: number },
  ) {
    this.groupChatMembers$ = this.groupChatsStore.select.groupChatMemberWebUsers$(data.groupChatId)
    this.groupChatId = data.groupChatId
    this.groupChatName = data.groupChatName
  }

  memberListChange(event: MatSelectionListChange) {
    this.selectedMembersToInvite = event.source.selectedOptions.selected.map((value) => value.value)
  }

  inviteSelectedMembers() {
    if (this.selectedMembersToInvite.length < 1) return
    const invites = this.selectedMembersToInvite.map(
      (member) =>
        ({
          userName: member.displayName,
          role: 'Member',
        } as MemberInviteModel),
    )
    const request: InviteToGroupChatRequest = {
      groupChatId: this.groupChatId,
      invites,
    }
    this.groupChatsStore.dispatch.inviteMembersToGroupChat(request)
  }
}
