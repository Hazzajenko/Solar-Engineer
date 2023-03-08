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
  NgTemplateOutlet,
} from '@angular/common'
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs'
import { FriendsStoreService } from '@app/data-access/friends'
import { ChatroomsComponent } from '@app/feature/chatrooms'
import { FriendsComponent } from '@app/feature/friends'
import { AuthStoreService } from '@auth/data-access'

import { AppUserLinkModel, AuthUserModel, CombinedAppUserModel, UserModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { GetFriendRequestPipe } from 'libs/app/feature/notifications/src/lib/get-friend-request.pipe'
import { SortNotificationsPipe } from 'libs/app/feature/notifications/src/lib/sort-notifications.pipe'
import { map, Observable, startWith, switchMap } from 'rxjs'
import { NotificationsComponent } from '@app/feature/notifications'
import { ActivatedRoute } from '@angular/router'
import { UsersService, UsersStoreService } from '@app/data-access/users'
import { ConnectionsStoreService } from '@app/data-access/connections'
import { GetCdnUrlStringPipe, TimeDifferenceFromNowPipe } from '@shared/pipes'
import { ChangeDisplayPictureComponent } from './change-display-picture/change-display-picture.component'
import { AddNewFriendComponent } from './add-new-friend/add-new-friend.component'
import { AppUserItemComponent } from './app-user-item/app-user-item.component'
import { SearchAppUserComponent } from './search-app-user/search-app-user.component'
import { MatAutocompleteModule } from '@angular/material/autocomplete'

// import { object } from 'zod'

@Component({
  selector: 'app-user-profile-component',
  templateUrl: './app-user-profile.component.html',
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
    ChatroomsComponent,
    TimeDifferenceFromNowPipe,
    GetCdnUrlStringPipe,
    AppUserItemComponent,
    NgTemplateOutlet,
    AddNewFriendComponent,
    SearchAppUserComponent,
    MatAutocompleteModule,
  ],
  standalone: true,
  providers: [DatePipe],
})
export class AppUserProfileComponent {
  private authStore = inject(AuthStoreService)
  private friendsStore = inject(FriendsStoreService)
  private route = inject(ActivatedRoute)
  private usersStore = inject(UsersStoreService)
  private usersService = inject(UsersService)
  private connectionsStore = inject(ConnectionsStoreService)
  private dialog = inject(MatDialog)
  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )
  searchFriendsControl = new FormControl('')
  user$: Observable<AuthUserModel | undefined> = this.authStore.select.user$
  appUser$: Observable<CombinedAppUserModel> = this.usersStore.select.personalCombinedAppUser$
  friends$: Observable<AppUserLinkModel[]> = this.usersStore.select.friends$
  // filteredFriends$!

  selectedFriend?: AppUserLinkModel

  // userProfile$: Observable<WebUserModel | undefined>
  autoCompleteControl = new FormControl('')
  filteredFriends$: Observable<AppUserLinkModel[] | undefined> =
    this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      switchMap((value) => this.filterFriends(value || '')),
    )

  autoCompleteDisplayFunc(appUser: AppUserLinkModel): string {
    return appUser && appUser.displayName ? appUser.displayName : ''
  }

  constructor(
    private dialogRef: MatDialogRef<AppUserProfileComponent>,
    @Inject(MAT_DIALOG_DATA) data: { user: UserModel },
  ) {
    this.appUser$.subscribe((res) => console.log(res))
  }

  changeDisplayPicture() {
    const dialogConfig = {
      autoFocus: true,
      height: '600px',
      width: '800px',
    } as MatDialogConfig

    this.dialog.open(ChangeDisplayPictureComponent, dialogConfig)
  }

  addUser() {
    const dialogConfig = {
      autoFocus: true,
      height: '400px',
      width: '400px',
    } as MatDialogConfig

    this.dialog.open(AddNewFriendComponent, dialogConfig)
  }

  selectFriendItem(friend: AppUserLinkModel) {
    if (this.selectedFriend === friend) {
      this.selectedFriend = undefined
      return
    }
    this.selectedFriend = friend
    return
  }

  search() {}

  private filterFriends(query: string): Observable<AppUserLinkModel[] | undefined> {
    const filterValue = query.toLowerCase()

    return this.friends$.pipe(
      map((data) =>
        data.filter((search) => search.displayName.toLowerCase().includes(filterValue)),
      ),
    )
  }
}
