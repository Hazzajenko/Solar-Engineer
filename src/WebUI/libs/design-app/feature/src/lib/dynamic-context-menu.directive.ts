import {
	ComponentRef,
	Directive,
	effect,
	inject,
	NgZone,
	OnDestroy,
	Renderer2,
	ViewContainerRef,
} from '@angular/core'
import { CONTEXT_MENU_COMPONENT, ContextMenuInput, UiStoreService } from '@design-app/data-access'
import {
	MultiplePanelsMenuComponent,
	SinglePanelMenuComponent,
	StringMenuComponent,
} from './context-menus'
import { toSignal } from '@angular/core/rxjs-interop'

@Directive({
	selector: '[appDynamicContextMenu]',
	exportAs: 'appDynamicContextMenu',
	standalone: true,
})
export class DynamicContextMenuDirective implements OnDestroy {
	private _uiStore = inject(UiStoreService)
	private _contextMenu = toSignal(this._uiStore.contextMenu$, {
		initialValue: this._uiStore.contextMenu,
	})
	private _viewContainerRef = inject(ViewContainerRef)
	private _ngZone = inject(NgZone)
	private renderer = inject(Renderer2)
	contextMenuRef?: ComponentRef<unknown>
	private _killEvent?: () => void

	get contextMenu() {
		return this._contextMenu()
	}

	constructor() {
		effect(() => {
			if (
				!this.contextMenu ||
				!this.contextMenu.currentContextMenu ||
				!this.contextMenu.contextMenuOpen
			) {
				this.contextMenuRef?.destroy()
				return
			}
			this._viewContainerRef.clear()
			this.contextMenuRef = this.switchFn(this.contextMenu.currentContextMenu)
			this._ngZone.runOutsideAngular(() => {
				this._killEvent = this.renderer.listen('document', 'click', (event: MouseEvent) => {
					if (!this.contextMenuRef) {
						this.ngOnDestroy()
						return
					}
					if (event.target instanceof Node && this.contextMenuRef.location) {
						if (this.contextMenuRef.location.nativeElement.contains(event.target)) return
					}
					this.ngOnDestroy()
				})
			})
		})
	}
	/*
	@Input() set contextMenu(contextMenu: ContextMenuInput) {
		if (!contextMenu) {
			this.contextMenuRef?.destroy()
			return
		}
		this._viewContainerRef.clear()
		this.contextMenuRef = this.switchFn(contextMenu)
	}*/

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
		this._killEvent?.()
		this.contextMenuRef?.destroy()
		this._uiStore.dispatch.closeContextMenu()
	}
}
