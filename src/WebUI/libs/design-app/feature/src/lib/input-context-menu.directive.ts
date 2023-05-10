import {
	ComponentRef,
	ContentChild,
	Directive,
	ElementRef,
	inject,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	Renderer2,
	ViewChild,
	ViewContainerRef,
} from '@angular/core'
import { CONTEXT_MENU_COMPONENT, ContextMenuInput } from '@design-app/data-access'
import {
	MultiplePanelsMenuComponent,
	SinglePanelMenuComponent,
	StringMenuComponent,
} from './context-menus'
import { DynamicContextMenuDirective } from '@design-app/feature'

// export type ContextMenuInputWithoutLocation = Omit<ContextMenuInput, 'location'>
type DistributiveOmit<T, K extends string> = T extends T ? Omit<T, K> : never

export type ContextMenuInputWithoutLocation = DistributiveOmit<ContextMenuInput, 'location'>
@Directive({
	selector: '[appInputContextMenu]',
	standalone: true,
})
export class InputContextMenuDirective implements OnInit, OnDestroy {
	private _buttonElement = inject(ElementRef<HTMLButtonElement>).nativeElement
	private _ngZone = inject(NgZone)
	private _renderer = inject(Renderer2)
	private _viewContainerRef = inject(ViewContainerRef)
	@ViewChild(DynamicContextMenuDirective, { static: true })
	dynamicContextMenu!: DynamicContextMenuDirective
	@ContentChild(DynamicContextMenuDirective, { static: true })
	dynamicContextMenu2!: DynamicContextMenuDirective
	contextMenuRef?: ComponentRef<unknown>
	contextMenuInput!: ContextMenuInput

	ngOnInit() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this._buttonElement, 'click', (event) => {
				event.preventDefault()
				event.stopPropagation()
				this.contextMenuRef = this.switchFn(this.contextMenuInput)
			})
		})
		console.log('this.dynamicContextMenu', this.dynamicContextMenu)
		console.log('this.dynamicContextMenu2', this.dynamicContextMenu2)
		/*		this._buttonElement.addEventListener('contextmenu', (event) => {
			event.preventDefault()
			event.stopPropagation()
			this.contextMenuRef?.destroy()
			this.contextMenuRef = this.switchFn(this.contextMenu)
		})*/
	}

	@Input({ required: true }) set contextMenu(contextMenu: ContextMenuInputWithoutLocation) {
		if (!contextMenu) {
			this.contextMenuRef?.destroy()
			return
		}
		this._viewContainerRef.clear()
		this.contextMenuInput = { ...contextMenu, location: { x: 500, y: 500 } }
		// this.contextMenuRef = this.switchFn({ ...contextMenu, location: { x: 0, y: 0 } })
	}
	// @Input({ required: true }) contextMenu!: ContextMenuInputWithoutLocation

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
