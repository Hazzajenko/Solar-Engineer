import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Input,
	OnDestroy,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
} from '@angular/core'
import { InputSvgComponent } from '@shared/ui'
import { NgForOf, NgIf, NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common'
import { StandaloneDatePipe, TimeDifferenceFromNowPipe, TruncatePipe } from '@shared/pipes'
import { LetDirective } from '@ngrx/component'
import { MatRippleModule } from '@angular/material/core'
import { opacityInOutAnimation } from '@shared/animations'
import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import { injectProjectsStore } from '@entities/data-access'
import { ProjectWebModel } from '@entities/shared'
import { DialogBackdropTemplateComponent } from '../../../dialog-backdrop-template/dialog-backdrop-template.component'
import { DialogWarningTemplateInputsComponent } from '../../../shared'
import { injectAppUser, injectUsersStore } from '@auth/data-access'
import { AuthWebUserAvatarComponent } from '@auth/ui'
import { FilterProjectMembersByOnlinePipe } from '@entities/utils'
import { PluralizePipe } from '@shared/utils'

@Component({
	selector: 'app-search-result-user',
	standalone: true,
	imports: [
		InputSvgComponent,
		NgIf,
		NgOptimizedImage,
		TimeDifferenceFromNowPipe,
		StandaloneDatePipe,
		LetDirective,
		MatRippleModule,
		NgTemplateOutlet,
		NgForOf,
		NgStyle,
		DialogBackdropTemplateComponent,
		DialogWarningTemplateInputsComponent,
		AuthWebUserAvatarComponent,
		FilterProjectMembersByOnlinePipe,
		PluralizePipe,
		TruncatePipe,
	],
	templateUrl: './search-result-project.component.html',
	styles: [],
	animations: [opacityInOutAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultProjectComponent implements OnDestroy {
	private _userOptionsOverlay: OverlayRef | undefined
	private _childSubMenuOverlay: OverlayRef | undefined
	private _viewContainerRef = inject(ViewContainerRef)
	private _overlay = inject(Overlay)
	private _projectsStore = injectProjectsStore()
	private _usersStore = injectUsersStore()
	@ViewChild('projectMenuDialog') private _projectMenuDialog!: TemplateRef<unknown>
	@ViewChild('dialogWarning') private _dialogWarning!: TemplateRef<unknown>
	user = injectAppUser()
	@Input({ required: true }) project!: ProjectWebModel
	amountOfProjectMembersOnline = this.project.members.filter((member) => member.isOnline).length

	openProjectMenu(): void {
		this._userOptionsOverlay = this._overlay.create({
			hasBackdrop: true,
			scrollStrategy: this._overlay.scrollStrategies.block(),
		})

		this._userOptionsOverlay.attach(
			new TemplatePortal(this._projectMenuDialog, this._viewContainerRef),
		)
	}

	/*
	 openInviteToProjectDialog(project: ProjectModel) {
	 const data: DialogWarningTemplateInput = {
	 title: `Invite ${this.user.displayName} to Project`,
	 message: `Are you sure you want to invite ${this.user.displayName} to this project?`,
	 buttonText: 'Invite',
	 buttonAction: () => {
	 this._projectsStore.dispatch.inviteUsersToProject({
	 projectId: project.id,
	 invites: [
	 {
	 userId: this.user.id,
	 role: 'Member',
	 canInvite: true,
	 canCreate: true,
	 canDelete: true,
	 canKick: true,
	 },
	 ],
	 })
	 },
	 }
	 this._childSubMenuOverlay?.detach()

	 this._childSubMenuOverlay = this._overlay.create({
	 hasBackdrop: true,
	 scrollStrategy: this._overlay.scrollStrategies.block(),
	 })
	 this._childSubMenuOverlay.attach(
	 new TemplatePortal(this._dialogWarning, this._viewContainerRef, {
	 data,
	 }),
	 )
	 }*/

	closeMenu() {
		this._userOptionsOverlay?.detach()
	}

	closeChildOverlay() {
		this._childSubMenuOverlay?.detach()
	}

	ngOnDestroy() {
		this._userOptionsOverlay?.dispose()
		this._childSubMenuOverlay?.dispose()
	}
}
