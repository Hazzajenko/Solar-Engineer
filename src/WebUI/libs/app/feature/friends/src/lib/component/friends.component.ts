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

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule, MatSelectionListChange } from '@angular/material/list'
import { FriendsService, FriendsStoreService } from '@app/data-access/friends'
import { AuthStoreService } from '@auth/data-access'

import { AppUserModel, FriendModel } from '@shared/data-access/models'
import { NotificationsStoreService } from '@app/data-access/notifications'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { Observable } from 'rxjs'
import { FriendDirective } from './friend.directive'

@Component({
	selector: 'app-friends-component',
	templateUrl: './friends.component.html',
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
		FriendDirective,
	],
	standalone: true,
})
export class FriendsComponent {
	private notificationsStore = inject(NotificationsStoreService)
	private authStore = inject(AuthStoreService)
	private friendsService = inject(FriendsService)
	private friendsStore = inject(FriendsStoreService)

	// notifications$: Observable<NotificationModel[]> = this.notificationsStore.select.notifications$
	user$: Observable<AppUserModel | undefined> = this.authStore.select.user$
	friends$ = this.friendsStore.select.friends$
	selectedFriend?: FriendModel

	change(event: MatSelectionListChange) {
		// console.log(event)
		this.selectedFriend = event.options[0].value
		/*    if ((event.options[0].value as NotificationModel).status === NotificationStatus.Unread) {
		 // this.readNotification()
		 }*/
	}
}
