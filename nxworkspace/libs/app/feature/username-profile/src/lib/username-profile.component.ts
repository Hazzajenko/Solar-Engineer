/* eslint-disable @angular-eslint/component-class-suffix */
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

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs'
import { FriendsStoreService } from '@app/data-access/friends'
import { ChatroomsComponent } from '@app/feature/chatrooms'
import { FriendsComponent } from '@app/feature/friends'
import { MessagesComponent } from '@app/messages'
import { AuthStoreService } from '@auth/data-access/facades'

import { FriendModel, UserModel, WebUserModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { GetFriendRequestPipe } from 'libs/app/feature/notifications/src/lib/get-friend-request.pipe'
import { SortNotificationsPipe } from 'libs/app/feature/notifications/src/lib/sort-notifications.pipe'
import {
  combineLatest,
  combineLatestWith,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs'
import { NotificationsComponent } from '../../../notifications/src/lib/component/notifications.component'
import { ActivatedRoute } from '@angular/router'
import { UsersService, UsersStoreService } from '@app/data-access/users'
import { RouterFacade } from '@shared/data-access/router'
import { ConnectionsStoreService } from '@shared/data-access/connections'
import { TimeDifferenceFromNowPipe } from '@shared/pipes'

@Component({
  selector: 'app-notifications-dialog',
  templateUrl: './userName-profile.component.html',
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
    SortNotificationsPipe,
    GetFriendRequestPipe,
    MatTabsModule,
    NotificationsComponent,
    FriendsComponent,
    MessagesComponent,
    ChatroomsComponent,
    TimeDifferenceFromNowPipe,
  ],
  standalone: true,
  providers: [DatePipe],
})
export class UsernameProfileComponent {
  private authStore = inject(AuthStoreService)
  private friendsStore = inject(FriendsStoreService)
  private route = inject(ActivatedRoute)
  private usersStore = inject(UsersStoreService)
  private usersService = inject(UsersService)
  private connectionsStore = inject(ConnectionsStoreService)
  private routerFacade = inject(RouterFacade)
  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  userProfile$: Observable<WebUserModel | undefined>

  constructor(
    private dialogRef: MatDialogRef<UsernameProfileComponent>,
    @Inject(MAT_DIALOG_DATA) data: { user: UserModel },
  ) {
    this.userProfile$ = this.usersStore.select.userByRouteParams$.pipe(
      switchMap((user) => {
        if (!user) {
          return this.usersService.getUserByUserName(data.user.userName).pipe(
            map((res) => res.user),
            tap((user) => this.usersStore.dispatch.addUser(user)),
          )
        }
        return of(user)
      }),
      switchMap((user) =>
        combineLatest([
          of(user),
          this.connectionsStore.select.isUserOnline$(user.userName),
          this.friendsStore.select.getUserFriendStatus$(user.userName),
        ]),
      ),
      map(([user, isOnline, isFriend]) => ({ ...user, ...isFriend, isOnline } as WebUserModel)),
    )
  }

  sendFriendRequest(userName: string) {
    this.friendsStore.dispatch.sendFriendRequest(userName)
  }

  sendMessage(userName: string) {
    this.dialogRef.close(userName)
  }
}
