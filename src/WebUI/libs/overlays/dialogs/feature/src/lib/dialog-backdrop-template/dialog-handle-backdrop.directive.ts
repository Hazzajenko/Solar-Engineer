import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core'
import { injectUiStore } from '@overlays/ui-store/data-access'

@Directive({
	selector: '[dialogHandleBackdrop]',
	standalone: true,
})
export class DialogHandleBackdropDirective {
	private _renderer = inject(Renderer2)
	private _element = inject(ElementRef<HTMLElement>).nativeElement
	private _uiStore = injectUiStore()
	private _dispose: ReturnType<typeof this._renderer.listen> | undefined = undefined

	@Input({ required: true }) set dialogHandleBackdrop(element: HTMLElement) {
		this._dispose = this._renderer.listen(this._element, 'click', (event: MouseEvent) => {
			const target = event.target as HTMLElement
			if (element?.contains(target)) return
			this.closeDialog()
		})
	}

	closeDialog() {
		this._dispose?.()
		this._uiStore.dispatch.closeDialog()
	}
}
