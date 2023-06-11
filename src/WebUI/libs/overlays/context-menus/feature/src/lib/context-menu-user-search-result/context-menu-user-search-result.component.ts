import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { increaseScaleAndOpacity } from '@shared/animations'
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { ContextMenuDirective } from '../directives'
import { TruncatePipe } from '@shared/pipes'
import { injectUsersStore } from '@auth/data-access'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { ContextMenuUserSearchResultMenu, injectUiStore } from '@overlays/ui-store/data-access'

@Component({
	selector: 'context-menu-user-search-result',
	standalone: true,
	imports: [
		ContextMenuDirective,
		NgForOf,
		ShowSvgNoStylesComponent,
		NgIf,
		NgOptimizedImage,
		TruncatePipe,
	],
	templateUrl: './context-menu-user-search-result.component.html',
	styles: [],
	animations: [increaseScaleAndOpacity],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuUserSearchResultComponent {
	private _uiStore = injectUiStore()
	private _usersStore = injectUsersStore()
	contextMenu = inject(Injector).get(
		contextMenuInputInjectionToken,
	) as ContextMenuUserSearchResultMenu
	webUser = this._usersStore.select.userSearchResultById(this.contextMenu.data.userId)

	sendFriendRequest() {
		this._usersStore.dispatch.sendFriendRequest(this.contextMenu.data.userId)
		this._uiStore.dispatch.closeContextMenu()
	}
}
