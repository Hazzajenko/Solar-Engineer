import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	InjectionToken,
	Injector,
	OnDestroy,
	Renderer2,
} from '@angular/core'
import {
	CONTEXT_MENU_COMPONENT,
	ContextMenuInput,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { NgComponentOutlet, NgIf } from '@angular/common'
import { SinglePanelMenuComponent } from '../single-panel-menu/single-panel-menu.component'
import { MultiplePanelsMenuComponent } from '../multiple-panels-menu/multiple-panels-menu.component'
import { StringMenuComponent } from '../string-menu/string-menu.component'
import { PanelLinkMenuComponent } from '../panel-link-menu'
import { ColourPickerMenuComponent } from '../colour-picker-menu/colour-picker-menu.component'
import {
	getElementByIdWithRetry,
	handleAllSwitchCases,
	initBackdropEventWithRenderer,
} from '@shared/utils'
import { ContextMenuProjectComponent } from '../context-menu-project'
import { ContextMenuModePickerComponent } from '../context-menu-mode-picker/context-menu-mode-picker.component'
import { ContextMenuUserSearchResultComponent } from '../context-menu-user-search-result/context-menu-user-search-result.component'
import { ContextMenuFriendComponent } from '../context-menu-friend/context-menu-friend.component'

export const contextMenuInputInjectionToken = new InjectionToken<ContextMenuInput>('')

@Component({
	selector: 'app-context-menu-renderer',
	standalone: true,
	imports: [NgIf, NgComponentOutlet],
	template: `
		<ng-container *ngIf="contextMenu() && component && contextMenuInjector">
			<ng-container *ngComponentOutlet="component; injector: contextMenuInjector" />
		</ng-container>
	`,
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuRendererComponent implements OnDestroy {
	private _uiStore = injectUiStore()
	private _renderer = inject(Renderer2)
	private _injector = inject(Injector)
	private killClickListener?: () => void
	contextMenu = this._uiStore.select.currentContextMenu
	contextMenuInjector: Injector | undefined

	component: ReturnType<typeof this.switchFn> | undefined

	constructor() {
		effect(() => {
			const contextMenu = this.contextMenu()
			if (!contextMenu) {
				return
			}

			this.component = this.switchFn(contextMenu.component)

			this.contextMenuInjector = Injector.create({
				providers: [
					{
						provide: contextMenuInputInjectionToken,
						useValue: contextMenu,
					},
				],
				parent: this._injector,
			})

			const componentId = contextMenu.component

			setTimeout(() => {
				const div = getElementByIdWithRetry(componentId)
				this.killClickListener = initBackdropEventWithRenderer(this._renderer, div, () => {
					this._uiStore.dispatch.closeContextMenu()
				})
			}, 100)
		})
	}

	ngOnDestroy() {
		this.killClickListener?.()
	}

	private switchFn(component: ContextMenuInput['component']) {
		switch (component) {
			case CONTEXT_MENU_COMPONENT.SINGLE_PANEL_MENU:
				return SinglePanelMenuComponent
			case CONTEXT_MENU_COMPONENT.MULTIPLE_PANELS_MENU:
				return MultiplePanelsMenuComponent
			case CONTEXT_MENU_COMPONENT.STRING_MENU:
				return StringMenuComponent
			case CONTEXT_MENU_COMPONENT.PANEL_LINK_MENU:
				return PanelLinkMenuComponent
			case CONTEXT_MENU_COMPONENT.COLOUR_PICKER_MENU:
				return ColourPickerMenuComponent
			case CONTEXT_MENU_COMPONENT.PROJECT_MENU:
				return ContextMenuProjectComponent
			case CONTEXT_MENU_COMPONENT.MODE_PICKER_MENU:
				return ContextMenuModePickerComponent
			case CONTEXT_MENU_COMPONENT.USER_SEARCH_RESULT_MENU:
				return ContextMenuUserSearchResultComponent
			case CONTEXT_MENU_COMPONENT.FRIEND_MENU:
				return ContextMenuFriendComponent
			default:
				return handleAllSwitchCases(component)
		}
	}
}
