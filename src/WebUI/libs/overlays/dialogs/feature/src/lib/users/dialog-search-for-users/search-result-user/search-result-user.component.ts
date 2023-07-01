import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Input,
	OnDestroy,
	signal,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
} from '@angular/core'
import { InputSvgComponent } from '@shared/ui'
import { NgForOf, NgIf, NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common'
import { WebUserModel } from '@auth/shared'
import { StandaloneDatePipe, TimeDifferenceFromNowPipe } from '@shared/pipes'
import { LetDirective } from '@ngrx/component'
import { MatRippleModule } from '@angular/material/core'
import { opacityInOutAnimation } from '@shared/animations'
import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import { injectProjectsStore } from '@entities/data-access'
import { ProjectModel } from '@entities/shared'
import { DialogBackdropTemplateComponent } from '../../../dialog-backdrop-template/dialog-backdrop-template.component'
import { DialogUserOptionsComponent } from '../../dialog-user-options/dialog-user-options.component'
import { DialogWarningTemplateInput, DialogWarningTemplateInputsComponent } from '../../../shared'
import { injectUsersStore } from '@auth/data-access'

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
		DialogUserOptionsComponent,
		DialogWarningTemplateInputsComponent,
	],
	templateUrl: './search-result-user.component.html',
	styles: [],
	animations: [opacityInOutAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultUserComponent implements OnDestroy {
	private _userOptionsOverlay: OverlayRef | undefined
	private _childSubMenuOverlay: OverlayRef | undefined
	private _viewContainerRef = inject(ViewContainerRef)
	private _overlay = inject(Overlay)
	private _projectsStore = injectProjectsStore()
	private _usersStore = injectUsersStore()
	@ViewChild('userContextMenu') private _userContextMenu!: TemplateRef<unknown>
	@ViewChild('dialogWarning') private _dialogWarning!: TemplateRef<unknown>
	@Input({ required: true }) user!: WebUserModel
	invitingToProject = signal(false)
	projectsThatFriendIsNotIn = computed(() => {
		const projects = this._projectsStore.select.allProjects()
		return projects.filter((project) => !project.memberIds.includes(this.user.id))
	})

	openUserMenu(): void {
		this._userOptionsOverlay = this._overlay.create({
			hasBackdrop: true,
			scrollStrategy: this._overlay.scrollStrategies.block(),
		})

		this._userOptionsOverlay.attach(
			new TemplatePortal(this._userContextMenu, this._viewContainerRef),
		)
	}

	openRemoveFriendDialog() {
		const data: DialogWarningTemplateInput = {
			title: `Remove Friend ${this.user.displayName}`,
			message: `Are you sure you want to remove ${this.user.displayName} as a friend?`,
			buttonText: 'Remove Friend',
			buttonAction: () => {
				this._usersStore.dispatch.removeFriend(this.user.id)
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
	}

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
	}

	closeMenu() {
		this._userOptionsOverlay?.detach()
	}

	closeChildOverlay() {
		this._childSubMenuOverlay?.detach()
	}

	openSendFriendRequestDialog() {
		const data: DialogWarningTemplateInput = {
			title: `Send Friend Request to ${this.user.displayName}`,
			message: `Are you sure you want to send ${this.user.displayName} a friend request?`,
			buttonText: 'Send',
			buttonAction: () => {
				this._usersStore.dispatch.sendFriendRequest(this.user.id)
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
	}

	ngOnDestroy() {
		this._userOptionsOverlay?.dispose()
		this._childSubMenuOverlay?.dispose()
	}

	sendFriendRequest() {
		this._usersStore.dispatch.sendFriendRequest(this.user.id)
	}
}
