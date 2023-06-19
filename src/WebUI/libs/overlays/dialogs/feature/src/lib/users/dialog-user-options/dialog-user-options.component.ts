import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Injector,
	signal,
} from '@angular/core'
import {
	DIALOG_COMPONENT,
	DialogInputUserOptions,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { dialogInputInjectionToken } from '../../dialog-renderer'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { InputSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { MatRippleModule } from '@angular/material/core'
import { NgForOf, NgIf, NgStyle } from '@angular/common'
import { injectProjectsStore } from '@entities/data-access'
import { ProjectModel } from '@entities/shared'
import { injectUsersStore } from '@auth/data-access'

@Component({
	selector: 'dialog-user-options',
	standalone: true,
	imports: [
		DialogBackdropTemplateComponent,
		InputSvgComponent,
		MatRippleModule,
		NgForOf,
		NgIf,
		ShowSvgNoStylesComponent,
		NgStyle,
	],
	templateUrl: './dialog-user-options.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogUserOptionsComponent {
	private _uiStore = injectUiStore()
	private _projectsStore = injectProjectsStore()
	private _dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputUserOptions
	private _usersStore = injectUsersStore()
	user = this._dialog.data.user
	invitingToProject = signal(false)
	projectsThatFriendIsNotIn = computed(() => {
		const projects = this._projectsStore.select.allProjects()
		return projects.filter((project) => !project.memberIds.includes(this.user.id))
	})

	openInviteToProjectDialog(project: ProjectModel) {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.INVITE_TO_PROJECT_CONFIRM,
			data: {
				projectId: project.id,
				userIdToInvite: this.user.id,
			},
		})
	}

	openRemoveFriendDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.WARNING_TEMPLATE,
			data: {
				title: `Remove Friend ${this.user.displayName}`,
				message: `Are you sure you want to remove ${this.user.displayName} as a friend?`,
				buttonText: 'Remove Friend',
				buttonAction: () => {
					console.log('removeFriend', this.user.id)
					this._usersStore.dispatch.removeFriend(this.user.id)
					this._uiStore.dispatch.closeDialog()
				},
			},
		})
	}
}
