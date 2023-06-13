import { ChangeDetectionStrategy, Component, computed, inject, Injector } from '@angular/core'
import { injectProjectsStore } from '@entities/data-access'
import { DialogInputInviteToProjectConfirm, injectUiStore } from '@overlays/ui-store/data-access'
import { dialogInputInjectionToken } from '@overlays/dialogs/feature'
import { increaseScaleAndOpacity } from '@shared/animations'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'
import { NgIf } from '@angular/common'
import { injectUsersStore } from '@auth/data-access'
import { assertNotNull } from '@shared/utils'

@Component({
	selector: 'dialog-invite-to-project-confirm',
	standalone: true,
	imports: [DialogBackdropTemplateComponent, NgIf],
	templateUrl: './dialog-invite-to-project-confirm.component.html',
	styles: [],
	animations: [increaseScaleAndOpacity],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogInviteToProjectConfirmComponent {
	private _projectsStore = injectProjectsStore()
	private _usersStore = injectUsersStore()
	private _uiStore = injectUiStore()

	dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputInviteToProjectConfirm

	project = this._projectsStore.select.selectById(this.dialog.data.projectId)
	userToInvite = this._usersStore.select.getById(this.dialog.data.userIdToInvite)

	vm = computed(() => {
		const project = this.project()
		const userToInvite = this.userToInvite()
		assertNotNull(project)
		assertNotNull(userToInvite)
		return {
			project,
			userToInvite,
		}
	})

	inviteToProject() {
		console.log('inviteToProject')
		this._projectsStore.dispatch.inviteUsersToProject({
			projectId: this.dialog.data.projectId,
			invites: [
				{
					userId: this.dialog.data.userIdToInvite,
					role: 'Member',
					canInvite: false,
					canCreate: false,
					canKick: false,
					canDelete: false,
				},
			],
		})
		this._uiStore.dispatch.closeDialog()
	}
}
