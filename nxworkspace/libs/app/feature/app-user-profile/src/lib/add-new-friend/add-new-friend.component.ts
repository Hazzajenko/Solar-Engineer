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
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs'
import { ChatroomsComponent } from '@app/feature/chatrooms'
import { FriendsComponent } from '@app/feature/friends'
import { MessagesComponent } from '@app/messages'
import { AuthStoreService } from '@auth/data-access/facades'

import {
  AppUserLinkModel,
  ToUserStatus,
  UserModel,
  UserToUserStatus,
} from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { map, Observable, tap } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { GetCdnUrlStringPipe, GetFullUrlPipe, TimeDifferenceFromNowPipe } from '@shared/pipes'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { LetModule } from '@ngrx/component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { UsersService, UsersStoreService } from '@app/data-access/users'

@Component({
  selector: 'app-add-new-friend-component',
  templateUrl: './add-new-friend.component.html',
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
    MatTabsModule,
    FriendsComponent,
    MessagesComponent,
    ChatroomsComponent,
    TimeDifferenceFromNowPipe,
    GetFullUrlPipe,
    GetCdnUrlStringPipe,
    MatProgressBarModule,
    LetModule,
    MatProgressSpinnerModule,
  ],
  standalone: true,
  providers: [DatePipe],
})
export class AddNewFriendComponent {
  private authStore = inject(AuthStoreService)
  private usersStore = inject(UsersStoreService)
  private route = inject(ActivatedRoute)
  readonly UserToUserStatus = UserToUserStatus
  // readonly ToUserStatus: ToUserStatus
  // readonly MessageFrom = MessageFrom
  userNameControl = new FormControl('')
  searching = false
  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  searchedUser$?: Observable<AppUserLinkModel | undefined>
  latestSearch?: string

  constructor(
    private dialogRef: MatDialogRef<AddNewFriendComponent>,
    @Inject(MAT_DIALOG_DATA) data: { user: UserModel },
  ) {
  }

  sendFriendRequest(userName: string | undefined | null) {
    if (!userName) return
    this.usersStore.dispatch.sendFriendRequest(userName)
  }

  search() {
    if (!this.userNameControl.value) return
    this.searching = true
    this.latestSearch = this.userNameControl.value
    this.searchedUser$ = this.usersStore.select
      .queryAppUser$(this.userNameControl.value)
      .pipe(tap(() => (this.searching = false)))
    // this.searching = false
  }

  viewProfile(userName: string) {
  }

  acceptFriend(userName: string) {

  }

  cancelRequest(userName: string) {

  }
}
