import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common'
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { RouterLink } from '@angular/router'
import { FriendsService, FriendsStoreService } from '@app/data-access/friends'
import { NotificationsStoreService } from '@app/data-access/notifications'
import { AuthStoreService } from '@auth/data-access/facades'
import { LetModule } from '@ngrx/component'
import { ProjectsStoreService } from '@projects/data-access/facades'

import { UserModel } from '@shared/data-access/models'
import { OnlineFriendsPipe } from '@shared/pipes'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { Observable } from 'rxjs'


@Component({
  selector: 'app-sidenav-component',
  templateUrl: './sidenav.component.html',
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
    RouterLink,
    LetModule,
    OnlineFriendsPipe,
  ],
  standalone: true,
})
export class SidenavComponent {

  private notificationsStore = inject(NotificationsStoreService)
  private authStore = inject(AuthStoreService)
  private friendsService = inject(FriendsService)
  private friendsStore = inject(FriendsStoreService)
  private projectsStore = inject(ProjectsStoreService)

  @Output() toggle = new EventEmitter<boolean>()
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  notifications$ = this.notificationsStore.select.notifications$
  friends$ = this.friendsStore.select.friends$
  projects$ = this.projectsStore.select.allProjects$
  viewProjects = false
  viewFriends = false
  viewNotifications = false

  closeDrawer() {
    this.toggle.emit(false)
  }

  showProjects() {
    this.viewProjects = !this.viewProjects
  }

  showFriends() {
    this.viewFriends = !this.viewFriends
  }

  showNotifications() {
    this.viewNotifications = !this.viewNotifications
  }


}

