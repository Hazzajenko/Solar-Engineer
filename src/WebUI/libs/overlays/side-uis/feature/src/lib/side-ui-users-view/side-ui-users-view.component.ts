import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { injectAuthStore, UsersSignalrService } from '@auth/data-access'
import { injectUiStore } from '@overlays/ui-store/data-access'
import { AppUserModel } from '@shared/data-access/models'
import { TruncatePipe } from '@shared/pipes'

@Component({
	selector: 'side-ui-users-view',
	standalone: true,
	imports: [NgForOf, ShowSvgNoStylesComponent, NgIf, NgClass, NgStyle, TruncatePipe],
	templateUrl: './side-ui-users-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiUsersViewComponent {
	private _authStore = injectAuthStore()
	private _uiStore = injectUiStore()
	private _usersSignalr = inject(UsersSignalrService)

	searchBoxTimer: ReturnType<typeof setTimeout> | undefined
	lastKeyUpTime = 0

	user = this._authStore.select.user

	friends = signal<AppUserModel[]>([])
	openedUsers = signal<Map<string, boolean>>(new Map())
	selectedUserId = signal<string | undefined>(undefined)

	selectUser(userId: AppUserModel['id']) {
		if (this.selectedUserId() === userId) return
		this.selectedUserId.set(userId)
	}

	toggleUserView(userId: AppUserModel['id']) {
		const id = userId
		this.openedUsers.set(new Map(this.openedUsers()).set(id, !this.openedUsers().get(id)))
	}

	openUserContextMenu(event: MouseEvent, userId: AppUserModel['id']) {
		/*		this._uiStore.dispatch.openContextMenu({
		 component: CONTEXT_MENU_COMPONENT.PROJECT_MENU,
		 data: { projectId: project.id },
		 location: { x: event.clientX, y: event.clientY },
		 })*/
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
		console.log(value)
		console.log(Date.now() - this.lastKeyUpTime)
		if (Date.now() - this.lastKeyUpTime < 500) {
			// if (this.searchBoxTimer) {
			// clearTimeout(this.searchBoxTimer)
			return
		}
		this._usersSignalr.searchForAppUserByUserName(value)
		// this._uiStore.dispatch.searchUsers(value)
	}
}
