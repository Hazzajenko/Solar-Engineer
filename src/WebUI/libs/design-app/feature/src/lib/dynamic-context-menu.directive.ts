import { ComponentRef, Directive, inject, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { CONTEXT_MENU_COMPONENT, ContextMenuInput } from '@design-app/data-access'
import {
	MultiplePanelsMenuComponent,
	SinglePanelMenuComponent,
	StringMenuComponent,
} from './context-menus'

@Directive({
	selector: '[appDynamicContextMenu]',
	standalone: true,
})
export class DynamicContextMenuDirective implements OnDestroy {
	private _viewContainerRef = inject(ViewContainerRef)
	contextMenuRef?: ComponentRef<unknown>

	@Input() set contextMenu(contextMenu: ContextMenuInput) {
		if (!contextMenu) {
			this.contextMenuRef?.destroy()
			return
		}
		this._viewContainerRef.clear()
		this.contextMenuRef = this.switchFn(contextMenu)
	}

	private switchFn(contextMenu: ContextMenuInput) {
		switch (contextMenu.component) {
			case CONTEXT_MENU_COMPONENT.SINGLE_PANEL_MENU:
				return (() => {
					const ref =
						this._viewContainerRef.createComponent<SinglePanelMenuComponent>(
							SinglePanelMenuComponent,
						)
					ref.instance.data = contextMenu.data
					ref.instance.location = contextMenu.location
					return ref
				})()
			case CONTEXT_MENU_COMPONENT.MULTIPLE_PANELS_MENU:
				return (() => {
					const ref = this._viewContainerRef.createComponent<MultiplePanelsMenuComponent>(
						MultiplePanelsMenuComponent,
					)
					ref.instance.data = contextMenu.data
					ref.instance.location = contextMenu.location
					return ref
				})()
			case CONTEXT_MENU_COMPONENT.STRING_MENU:
				return (() => {
					const ref =
						this._viewContainerRef.createComponent<StringMenuComponent>(StringMenuComponent)
					ref.instance.data = contextMenu.data
					ref.instance.location = contextMenu.location
					return ref
				})()
			default:
				return (() => {
					throw new Error('Invalid dialog component')
				})()
		}
	}

	ngOnDestroy(): void {
		this.contextMenuRef?.destroy()
	}
}
