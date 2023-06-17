import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import {
	ContextMenuFriendMenu,
	DIALOG_COMPONENT,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { injectUsersStore } from '@auth/data-access'
import { NgForOf, NgIf, NgOptimizedImage, NgStyle } from '@angular/common'
import { scaleAndOpacityAnimation } from '@shared/animations'
import { InputSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { TruncatePipe } from '@shared/pipes'
import { ContextMenuDirective } from '../directives'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { injectProjectsStore } from '@entities/data-access'
import { ProjectModel } from '@entities/shared'

@Component({
	selector: 'context-menu-friend',
	standalone: true,
	imports: [
		ContextMenuDirective,
		NgIf,
		ShowSvgNoStylesComponent,
		NgOptimizedImage,
		TruncatePipe,
		NgForOf,
		NgStyle,
		InputSvgComponent,
	],
	templateUrl: './context-menu-friend.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [scaleAndOpacityAnimation],
})
export class ContextMenuFriendComponent {
	private _uiStore = injectUiStore()
	private _projectsStore = injectProjectsStore()
	private _usersStore = injectUsersStore()
	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuFriendMenu
	webUser = this._usersStore.select.getById(this.contextMenu.data.userId)
	projects = this._projectsStore.select.allProjects

	sendMessage() {
		// TODO: implement
		console.log('send message')
	}

	removeFriend() {
		this._usersStore.dispatch.removeFriend(this.contextMenu.data.userId)
	}

	openInviteToProjectDialog(project: ProjectModel) {
		console.log('invite to project')
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.INVITE_TO_PROJECT_CONFIRM,
			data: {
				projectId: project.id,
				userIdToInvite: this.contextMenu.data.userId,
			},
		})
		this._uiStore.dispatch.closeContextMenu()
	}

	blockUser() {
		// TODO: implement
		console.log('block user')
	}

	openProfile() {
		// TODO: implement
		console.log('open profile')
	}
}
