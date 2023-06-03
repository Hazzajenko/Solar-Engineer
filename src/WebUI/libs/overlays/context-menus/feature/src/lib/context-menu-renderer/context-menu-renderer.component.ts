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
import { getElementByIdWithRetry, initBackdropEventWithRenderer } from '@shared/utils'

export const contextMenuInputInjectionToken = new InjectionToken<ContextMenuInput>('')

@Component({
	selector: 'app-context-menu-renderer',
	standalone: true,
	imports: [NgIf, NgComponentOutlet],
	template: `
		<ng-container *ngIf="contextMenu && component && contextMenuInjector">
			<ng-container *ngComponentOutlet="component; injector: contextMenuInjector" />
		</ng-container>
	`,
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuRendererComponent implements OnDestroy {
	private _uiStore = injectUiStore()
	private _renderer = inject(Renderer2)
	private _contextMenu = this._uiStore.select.currentContextMenu
	private _injector = inject(Injector)

	private killClickListener?: () => void

	contextMenuInjector: Injector | undefined

	component: ReturnType<typeof this.switchFn> | undefined

	constructor() {
		effect(() => {
			if (
				!this.contextMenu
				/*				!this.contextMenu ||
				 !this.contextMenu.currentContextMenu ||
				 !this.contextMenu.contextMenuOpen*/
			) {
				return
			}

			this.component = this.switchFn(this.contextMenu)

			this.contextMenuInjector = Injector.create({
				providers: [
					{
						provide: contextMenuInputInjectionToken,
						useValue: this.contextMenu,
					},
				],
				parent: this._injector,
			})

			const componentId = this.contextMenu.component

			setTimeout(() => {
				const div = getElementByIdWithRetry(componentId)
				this.killClickListener = initBackdropEventWithRenderer(this._renderer, div, () => {
					this._uiStore.dispatch.closeContextMenu()
				})
			}, 100)
		})
	}

	get contextMenu() {
		return this._contextMenu()
	}

	ngOnDestroy() {
		this.killClickListener?.()
	}

	private switchFn(contextMenu: ContextMenuInput) {
		switch (contextMenu.component) {
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
			default:
				throw new Error('Unknown context menu component')
		}
	}
}
