import { ScrollingModule } from '@angular/cdk/scrolling'
import {
  AsyncPipe,
  DatePipe,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule, MatSelectionListChange } from '@angular/material/list'
import { ActivatedRoute, Router } from '@angular/router'
// import { MessagesComponent } from '@app/messages'
import { AuthStoreService } from '@auth/data-access'
import { LetModule } from '@ngrx/component'

import { AuthUserModel, UserModel, WebUserModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { map, Observable, of, switchMap } from 'rxjs'
import { FriendsStoreService } from '@app/data-access/friends'
import { UsersStoreService } from '@app/data-access/users'
import { combineLatest } from 'rxjs'
import { CreateGroupChatRequest, GroupChatsStoreService } from '@app/data-access/group-chats'
import { GroupChatMemberItemComponent } from '../conversation/member-item/group-chat-member-item.component'
import { GetCdnUrlStringPipe } from '@shared/pipes'

@Component({
  selector: 'app-new-chat-room-component',
  templateUrl: './new-chat-room.component.html',
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
    LetModule,
    // MessagesComponent,
    GroupChatMemberItemComponent,
    GetCdnUrlStringPipe,
  ],
  standalone: true,
})
export class NewChatRoomComponent {
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

  memberListChange(event: MatSelectionListChange) {
    this.selectedMembersToInvite = event.source.selectedOptions.selected.map((value) => value.value)
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
}
