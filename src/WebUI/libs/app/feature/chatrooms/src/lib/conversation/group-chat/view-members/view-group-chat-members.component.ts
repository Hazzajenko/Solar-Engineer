import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common'
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule, MatSelectionListChange } from '@angular/material/list'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthStoreService } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'

import { AuthUserModel, GroupChatMemberModel, PermissionsModel, WebUserModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { combineLatest, map, Observable, switchMap } from 'rxjs'
import { FriendsStoreService } from '@app/data-access/friends'
import { UsersStoreService } from '@app/data-access/users'
import {
  CreateGroupChatRequest,
  GroupChatsStoreService,
  RemoveFromGroupChatRequest,
} from '@app/data-access/group-chats'
import { GroupChatMemberItemComponent } from '../../member-item/group-chat-member-item.component'

@Component({
  selector: 'app-view-group-chat-members-component',
  templateUrl: './view-group-chat-members.component.html',
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
  standalone: true,
})
export class ViewGroupChatMembersComponent {
  private authStore = inject(AuthStoreService)
  private friendsStore = inject(FriendsStoreService)
  private usersStore = inject(UsersStoreService)
  private groupChatsStore = inject(GroupChatsStoreService)
  private dialog = inject(MatDialog)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  chatRoomNameControl = new FormControl('')

  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )
  user$: Observable<AuthUserModel | undefined> = this.authStore.select.user$
  selectedMembersToInvite: WebUserModel[] = []
  selectedMember?: GroupChatMemberModel
  groupChatMembers$: Observable<GroupChatMemberModel[]>
  groupChatId: number
  groupChatName: string
  groupChatPermissions: PermissionsModel
  kickMode = false
  // membersToInvite$

  membersToInvite$: Observable<WebUserModel[]> = this.friendsStore.select.friends$.pipe(
    map((friends) => friends),
    switchMap((friends) =>
      combineLatest(
        friends.map((friend) =>
          this.usersStore.select.webUserCombinedByUserName$(friend.displayName),
        ),
      ),
    ),
  )

  constructor(
    private dialogRef: MatDialogRef<ViewGroupChatMembersComponent>,
    @Inject(MAT_DIALOG_DATA)
      data: { groupChatId: number; groupChatName: string; groupChatPermissions: PermissionsModel },
  ) {
    this.groupChatMembers$ = this.groupChatsStore.select.groupChatMemberWebUsers$(data.groupChatId)
    this.groupChatId = data.groupChatId
    this.groupChatName = data.groupChatName
    this.groupChatPermissions = data.groupChatPermissions
  }

  memberListChange(event: MatSelectionListChange) {
    this.selectedMembersToInvite = event.source.selectedOptions.selected.map((value) => value.value)
    this.selectedMember = event.source.selectedOptions.selected[0].value as GroupChatMemberModel
  }

  createChatRoom() {
    if (!this.chatRoomNameControl.value || this.chatRoomNameControl.value?.length < 3) return
    const request: CreateGroupChatRequest = {
      groupChatName: this.chatRoomNameControl.value,
      userNamesToInvite:
        this.selectedMembersToInvite.length > 0
          ? this.selectedMembersToInvite.map((m) => m.displayName)
          : [],
    }
    this.groupChatsStore.dispatch.createGroupChat(request)
  }

  removeFromGroup() {
    const userNames = this.selectedMembersToInvite.map((m) => m.displayName)
    const request: RemoveFromGroupChatRequest = {
      groupChatId: this.groupChatId,
      userNames,
    }
    this.groupChatsStore.dispatch.removeUsersFromGroup(request)
  }

  enableKickMode() {
    this.kickMode = !this.kickMode
  }
}
