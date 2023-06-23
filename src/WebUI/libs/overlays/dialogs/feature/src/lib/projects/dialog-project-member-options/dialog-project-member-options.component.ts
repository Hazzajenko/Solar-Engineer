import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, Injector, OnInit, signal } from '@angular/core'
import { DIALOG_COMPONENT, DialogInputProjectMemberOptions, injectUiStore } from '@overlays/ui-store/data-access'
import { injectProjectsStore } from '@entities/data-access'
import { dialogInputInjectionToken } from '@overlays/dialogs/feature'
import { injectUsersStore } from '@auth/data-access'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { InputSvgComponent } from '@shared/ui'
import { ErrorStateMatcher, MatRippleModule } from '@angular/material/core'
import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common'
import { FormBuilder, FormControl, FormGroupDirective, NG_VALUE_ACCESSOR, NgForm, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSelectModule } from '@angular/material/select'
import { ProjectMemberPermissions, ProjectUserRole } from '@entities/shared'
import { opacityInOutAnimation } from '@shared/animations'
import { LetDirective } from '@ngrx/component'

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted))
	}
}

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
		MatSelectModule,
		NgTemplateOutlet,
		LetDirective,
	],
	templateUrl: './dialog-project-member-options.component.html',
	styles: [],
	animations: [opacityInOutAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DialogProjectMemberOptionsComponent),
			multi: true,
		},
	],
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
		// role: ['Member' as ProjectUserRole, Validators.required],
		canCreate: [false, Validators.requiredTrue],
		canInvite: [false, Validators.requiredTrue],
		canKick: [false, Validators.requiredTrue],
		canDelete: [false, Validators.requiredTrue],
	})

	// matcher = new MyErrorStateMatcher()

	project = this._dialog.data.project
	member = this._dialog.data.member
	originalMemberRole = this.member.role
	originalPermissions = {
		canCreate: this.member.canCreate,
		canInvite: this.member.canInvite,
		canKick: this.member.canKick,
		canDelete: this.member.canDelete,
	}
	currentUserMember = this._dialog.data.currentUserMember
	// roleValueHasBeenChanged = this.permissionsForm.controls.role.value !== this.originalMemberRole
	permissions: {
		name: string
		value: keyof ProjectMemberPermissions
	}[] = [
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

	userCanChangeRole =
		this.currentUserMember.role === 'Owner' ||
		(this.currentUserMember.role === 'Admin' && this.member.role === 'Member')
	editingPermissions = signal(false)
	selectingRole = signal(false)
	currentPermissions = signal<ProjectMemberPermissions>({
		canCreate: false,
		canInvite: false,
		canKick: false,
		canDelete: false,
	})

	currentRoleValue = signal<ProjectUserRole>('Member')
	roleValueHasBeenChanged = computed(() => {
		const roleValue = this.currentRoleValue()
		return roleValue !== this.originalMemberRole
	})
	permissionsValueHasBeenChanged = computed(() => {
		const permissions = this.currentPermissions()
		return (
			permissions.canCreate !== this.originalPermissions.canCreate ||
			permissions.canInvite !== this.originalPermissions.canInvite ||
			permissions.canKick !== this.originalPermissions.canKick ||
			permissions.canDelete !== this.originalPermissions.canDelete
		)
	})

	ngOnInit() {
		console.log('ngOnInit', this.member)
		this.currentRoleValue.set(this.member.role)
		this.currentPermissions.set({
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
					this._projectsStore.dispatch.kickProjectMember({
						projectId: this.project.id,
						memberId: this.member.id,
					})
				},
			},
		})
	}

	togglePermission(permission: keyof ProjectMemberPermissions) {
		console.log('togglePermission', permission)
		this.currentPermissions.mutate((x) => (x[permission] = !x[permission]))
		console.log('this.currentPermissions', this.currentPermissions())
	}

	savePermissions() {
		const permissions = this.currentPermissions()
		this._projectsStore.dispatch.updateProjectMember({
			projectId: this.project.id,
			memberId: this.member.id,
			changes: {
				role: this.currentRoleValue(),
				canCreate: permissions.canCreate,
				canInvite: permissions.canInvite,
				canKick: permissions.canKick,
				canDelete: permissions.canDelete,
			},
		})
		this.editingPermissions.set(false)
	}

	setRoleValue(role: ProjectUserRole) {
		/*		if (role !== this.originalMemberRole) {

		 // console.log('permissionsForm', this.permissionsForm)
		 // this.permissionsForm.markAsPristine()
		 } */
		this.currentRoleValue.set(role)
		// this.permissionsForm.patchValue({ role })
		this.selectingRole.set(false)
	}

	startEditingRole() {
		this.selectingRole.set(true)
	}
}
