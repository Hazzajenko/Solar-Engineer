import { ChangeDetectionStrategy, Component, computed, Signal, signal } from '@angular/core'
import { NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { injectAuthStore, injectUsersStore } from '@auth/data-access'
import { CONTEXT_MENU_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'
import { TruncatePipe } from '@shared/pipes'
import { isWebUser, minimalToWebUser, WebUserModel } from '@auth/shared'
import { notification } from '@tauri-apps/api'
// import { injectUsersStore } from '@users/data-access'

// import { injectUsersStore } from '@users/data-access'

@Component({
	selector: 'side-ui-users-view',
	standalone: true,
	imports: [
		NgForOf,
		ShowSvgNoStylesComponent,
		NgIf,
		NgClass,
		NgStyle,
		TruncatePipe,
		NgOptimizedImage,
		NgTemplateOutlet,
	],
	templateUrl: './side-ui-users-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiUsersViewComponent {
	private _authStore = injectAuthStore()
	private _uiStore = injectUiStore()
	// private _usersSignalr = inject(UsersSignalrService)
	private _usersStore = injectUsersStore()

	searchBoxTimer: ReturnType<typeof setTimeout> | undefined
	lastKeyUpTime = 0

	user = this._authStore.select.user

	userSearchResults = computed(() => {
		const results = this._usersStore.select.userSearchResults()
		const filteredNotAuthUser = results.filter((r) => r.id !== this.user()?.id)
		return filteredNotAuthUser.map(minimalToWebUser)
	})
	// userSearchResults = this._usersStore.select.userSearchResults

	friends = this._usersStore.select.allFriends as Signal<WebUserModel[]>
	openedUsers = signal<Map<string, boolean>>(new Map())
	selectedUserId = signal<string | undefined>(undefined)
	protected readonly isWebUser = isWebUser
	protected readonly notification = notification

	selectUser(userId: string) {
		if (this.selectedUserId() === userId) return
		this.selectedUserId.set(userId)
	}

	toggleUserView(userId: string) {
		const id = userId
		this.openedUsers.set(new Map(this.openedUsers()).set(id, !this.openedUsers().get(id)))
	}

	openUserContextMenu(event: MouseEvent, user: WebUserModel) {
		event.preventDefault()
		event.stopPropagation()

		if (user.isFriend) {
			this._uiStore.dispatch.openContextMenu({
				component: CONTEXT_MENU_COMPONENT.FRIEND_MENU,
				data: { userId: user.id },
				location: { x: event.clientX, y: event.clientY },
			})
			return
		}
		this._uiStore.dispatch.openContextMenu({
			component: CONTEXT_MENU_COMPONENT.USER_SEARCH_RESULT_MENU,
			data: { userId: user.id },
			location: { x: event.clientX, y: event.clientY },
		})
	}

	onSearchBoxKeyDown(event: KeyboardEvent) {
		event.preventDefault()
		event.stopPropagation()

		const target = event.target as HTMLInputElement
		const value = target.value
		console.log(value)
		if (event.key === 'Enter') {
			this.querySearchBox(value)
			return
		}

		this.lastKeyUpTime = Date.now()
		setTimeout(() => {
			this.querySearchBox(value)
			// clearTimeout(this.searchBoxTimer)
		}, 500)
	}

	private querySearchBox(value: string) {
		if (Date.now() - this.lastKeyUpTime < 500) {
			return
		}

		if (value.length < 1) {
			this._usersStore.dispatch.clearUserSearchResults()
			return
		}
		// this._usersSignalr.searchForAppUserByUserName(value)
		this._usersStore.dispatch.searchForAppUserByUserName(value)
		// this._uiStore.dispatch.searchUsers(value)
	}
}
