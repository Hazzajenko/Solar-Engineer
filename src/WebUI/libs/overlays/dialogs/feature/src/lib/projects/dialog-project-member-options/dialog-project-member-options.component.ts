import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, signal } from '@angular/core'
import {
	DIALOG_COMPONENT,
	DialogInputProjectMemberOptions,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { injectProjectsStore } from '@entities/data-access'
import { dialogInputInjectionToken } from '@overlays/dialogs/feature'
import { injectUsersStore } from '@auth/data-access'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { InputSvgComponent } from '@shared/ui'
import { MatRippleModule } from '@angular/material/core'
import { NgClass, NgForOf, NgIf } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

@Component({
	selector: 'dialog-project-member-options',
	standalone: true,
	imports: [
		DialogBackdropTemplateComponent,
		InputSvgComponent,
		MatRippleModule,
		NgForOf,
		NgIf,
		ReactiveFormsModule,
		MatSlideToggleModule,
		NgClass,
	],
	templateUrl: './dialog-project-member-options.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogProjectMemberOptionsComponent implements OnInit {
	private _uiStore = injectUiStore()
	private _formBuilder = inject(FormBuilder)
	private _projectsStore = injectProjectsStore()
	private _dialog = inject(Injector).get(
		dialogInputInjectionToken,
	) as DialogInputProjectMemberOptions
	private _usersStore = injectUsersStore()

	permissionsForm = this._formBuilder.group({
		canCreate: [false, Validators.requiredTrue],
		canInvite: [false, Validators.requiredTrue],
		canKick: [false, Validators.requiredTrue],
		canDelete: [false, Validators.requiredTrue],
	})

	project = this._dialog.data.project
	member = this._dialog.data.member
	currentUserMember = this._dialog.data.currentUserMember
	permissions = [
		{ name: 'Can Create', value: 'canCreate' },
		{ name: 'Can Invite', value: 'canInvite' },
		{ name: 'Can Kick', value: 'canKick' },
		{ name: 'Can Delete', value: 'canDelete' },
	]

	userCanEditPermissions =
		this.currentUserMember.role === 'Owner' || this.currentUserMember.role === 'Admin'

	userCanKick =
		(this.currentUserMember.role === 'Owner' && this.member.role !== 'Owner') ||
		(this.currentUserMember.role === 'Admin' && this.member.role === 'Member')

	editingPermissions = signal(false)

	ngOnInit() {
		this.permissionsForm.setValue({
			canCreate: this.member.canCreate,
			canInvite: this.member.canInvite,
			canKick: this.member.canKick,
			canDelete: this.member.canDelete,
		})
	}

	openKickFromProjectDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.WARNING_TEMPLATE,
			data: {
				title: `Remove ${this.member.displayName} from ${this.project.name}`,
				message: `Are you sure you want to remove ${this.member.displayName} from ${this.project.name}?`,
				buttonText: 'Remove',
				buttonAction: () => {
					console.log('kickFromProject', this.member.id)
					// this._projectsStore.dispatch.
					// this._uiStore.dispatch.closeDialog()
				},
			},
		})
	}

	savePermissions(permissionsForm: FormGroup) {}
}
