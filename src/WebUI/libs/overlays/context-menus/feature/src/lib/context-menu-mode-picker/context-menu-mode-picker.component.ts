import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { transitionContextMenu } from '../animations/context-menu.animation'
import { ContextMenuModePickerMenu } from '@overlays/ui-store/data-access'
import { NgClass, NgForOf, NgStyle } from '@angular/common'
import { injectAppStateStore } from '@canvas/app/data-access'
import { ContextMenuDirective } from '../directives'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'

@Component({
	selector: 'context-menu-mode-picker',
	standalone: true,
	imports: [ContextMenuDirective, NgForOf, NgClass, NgStyle],
	templateUrl: './context-menu-mode-picker.component.html',
	styles: [],
	animations: [transitionContextMenu],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuModePickerComponent {
	private _appStore = injectAppStateStore()

	currentMode = this._appStore.select.mode
	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuModePickerMenu
}
