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
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs'
import { ChatroomsComponent } from '@app/feature/chatrooms'
import { FriendsComponent } from '@app/feature/friends'

import { AppUserLinkModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { Observable, tap } from 'rxjs'
import { GetCdnUrlStringPipe, GetFullUrlPipe, TimeDifferenceFromNowPipe } from '@shared/pipes'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { LetModule } from '@ngrx/component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { UsersStoreService } from '@app/data-access/users'

@Component({
  selector: 'app-search-app-user-component',
  templateUrl: './search-app-user.component.html',
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
export class SearchAppUserComponent {
  private usersStore = inject(UsersStoreService)
  userNameControl = new FormControl('')
  searching = false
  searchedUser$?: Observable<AppUserLinkModel | undefined>
  latestSearch?: string

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
}
