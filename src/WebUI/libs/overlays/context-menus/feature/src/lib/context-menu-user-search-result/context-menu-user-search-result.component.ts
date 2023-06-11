import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { increaseScaleAndOpacity } from '@shared/animations'
import { ContextMenuUserSearchResultMenu } from '@overlays/ui-store/data-access'
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { injectUsersStore } from '@users/data-access'
import { ContextMenuDirective } from '../directives'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { TruncatePipe } from '@shared/pipes'

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
	private _usersStore = injectUsersStore()
	contextMenu = inject(Injector).get(
		contextMenuInputInjectionToken,
	) as ContextMenuUserSearchResultMenu
	webUser = this._usersStore.select.userSearchResultById(this.contextMenu.data.userId)
}
