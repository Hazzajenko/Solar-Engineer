import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { injectAuthStore } from '@auth/data-access'
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

	/*	openSignInDialog() {
	 this._uiStore.dispatch.openDialog({
	 component: DIALOG_COMPONENT.SIGN_IN,
	 })
	 }*/

	// protected readonly createProject = createProject
	// protected readonly createProject = createProject
}
