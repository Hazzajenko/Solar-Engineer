import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { ContextMenuFriendMenu, injectUiStore } from '@overlays/ui-store/data-access'
import { injectUsersStore } from '@auth/data-access'
import { NgIf, NgOptimizedImage } from '@angular/common'
import { increaseScaleAndOpacity } from '@shared/animations'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { TruncatePipe } from '@shared/pipes'
import { ContextMenuDirective } from '../directives'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'

@Component({
	selector: 'context-menu-friend',
	standalone: true,
	imports: [ContextMenuDirective, NgIf, ShowSvgNoStylesComponent, NgOptimizedImage, TruncatePipe],
	templateUrl: './context-menu-friend.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [increaseScaleAndOpacity],
})
export class ContextMenuFriendComponent {
	private _uiStore = injectUiStore()
	private _usersStore = injectUsersStore()
	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuFriendMenu
	webUser = this._usersStore.select.getById(this.contextMenu.data.userId)

	sendMessage() {
		// TODO: implement
		console.log('send message')
	}

	removeFriend() {
		this._usersStore.dispatch.removeFriend(this.contextMenu.data.userId)
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
