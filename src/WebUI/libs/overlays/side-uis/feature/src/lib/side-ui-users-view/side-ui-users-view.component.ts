import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Injector,
	signal,
} from '@angular/core'
import {
	NgClass,
	NgForOf,
	NgIf,
	NgOptimizedImage,
	NgStyle,
	NgTemplateOutlet,
} from '@angular/common'
import { InputSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { injectAuthStore, injectUsersStore } from '@auth/data-access'
import {
	CONTEXT_MENU_COMPONENT,
	DIALOG_COMPONENT,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { TruncatePipe } from '@shared/pipes'
import { minimalToWebUser, WebUserModel } from '@auth/shared'
import { notification } from '@tauri-apps/api'
import { LetDirective } from '@ngrx/component'
import { SideUiBaseComponent } from '../side-ui-base/side-ui-base.component'
import {
	sideUiInjectionToken,
	SideUiNavBarView,
} from '../side-ui-nav-bar/side-ui-nav-bar.component'
import { SideUiViewHeadingComponent } from '../shared'
import { UsersViewUserPreviewComponent } from './users-view-user-preview/users-view-user-preview.component'
import { UsersViewWebUserItemComponent } from './users-view-web-user-item/users-view-web-user-item.component'

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
		LetDirective,
		SideUiBaseComponent,
		SideUiViewHeadingComponent,
		UsersViewWebUserItemComponent,
		UsersViewUserPreviewComponent,
		UsersViewWebUserItemComponent,
		InputSvgComponent,
	],
	templateUrl: './side-ui-users-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiUsersViewComponent {
	private _authStore = injectAuthStore()
	private _uiStore = injectUiStore()
	private _usersStore = injectUsersStore()

	sideUiView = inject(Injector).get(sideUiInjectionToken) as SideUiNavBarView

	searchBoxTimer: ReturnType<typeof setTimeout> | undefined
	lastKeyUpTime = 0

	user = this._authStore.select.user

	userSearchResults = computed(() => {
		const results = this._usersStore.select.userSearchResults()
		const filteredNotAuthUser = results.filter((r) => r.id !== this.user()?.id)
		return filteredNotAuthUser.map(minimalToWebUser)
	})

	friends = this._usersStore.select.allFriends
	amountOfFriendsOnline = computed(() => {
		const friends = this.friends()
		const onlineFriends = friends.filter((f) => f.isOnline)
		return onlineFriends.length
	})
	/*	friends = computed(() => {
	 const friends = this._usersStore.select.allFriends()
	 const fakeData = GenerateFriendData(10)
	 return friends.concat(fakeData)
	 })*/

	webUserSorter = signal<keyof WebUserModel | undefined>('lastActiveTime')
	friendsSorted = computed(() => {
		const friends = this.friends()
		const sorter = this.webUserSorter()
		if (!sorter) return friends
		if (
			sorter === 'lastActiveTime' ||
			sorter === 'registeredAtTime' ||
			sorter === 'becameFriendsTime'
		) {
			return friends.sort((a, b) => {
				const aKey = a[sorter]
				const bKey = b[sorter]
				if (!aKey || !bKey) return 0
				const aTime = new Date(aKey).getTime()
				const bTime = new Date(bKey).getTime()
				if (aTime < bTime) return 1
				if (aTime > bTime) return -1
				return 0
			})
		}
		if (sorter === 'isOnline') {
			return friends.sort((a, b) => {
				const aKey = a[sorter]
				const bKey = b[sorter]
				if (aKey && !bKey) return -1
				if (!aKey && bKey) return 1
				return 0
			})
		}
		return friends
	})

	openedUsers = signal<Set<string>>(new Set())
	selectedUserId = signal<string | undefined>(undefined)
	protected readonly notification = notification

	webUserModelTrackByFn(index: number, item: WebUserModel) {
		return item.id || index
	}

	selectUser(userId: string) {
		if (this.selectedUserId() === userId) return
		this.selectedUserId.set(userId)
	}

	toggleUserView(userId: string) {
		const id = userId
		this.openedUsers.update((openedUsers) => {
			if (openedUsers.has(id)) {
				openedUsers.delete(id)
			} else {
				openedUsers.add(id)
			}
			return openedUsers
		})
		// this.openedUsers.set(new Set(this.openedUsers()).add(id))
		// this.openedUsers.set(new Map(this.openedUsers()).set(id, !this.openedUsers().get(id)))
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
		}, 500)
	}

	openUserOptionsDialog(user: WebUserModel) {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.USER_OPTIONS,
			data: { user },
		})
	}

	openSearchForUsersDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.SEARCH_FOR_USERS,
		})
	}

	private querySearchBox(value: string) {
		if (Date.now() - this.lastKeyUpTime < 500) {
			return
		}

		if (value.length < 1) {
			this._usersStore.dispatch.clearUserSearchResults()
			return
		}
		this._usersStore.dispatch.searchForAppUser({
			searchQuery: value,
		})
	}
}
