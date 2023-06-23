import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core'
import { injectUiStore } from '@overlays/ui-store/data-access'

@Directive({
	selector: '[dialogBackdropTemplate]',
	standalone: true,
})
export class DialogBackdropTemplateDirective implements OnInit {
	private _renderer = inject(Renderer2)
	private _element = inject(ElementRef<HTMLElement>).nativeElement
	private _uiStore = injectUiStore()
	private _dispose: ReturnType<typeof this._renderer.listen> | undefined = undefined

	ngOnInit() {
		this._dispose = this._renderer.listen(this._element, 'click', (event: MouseEvent) => {
			console.log('click', event, this._element)
			const dialogContentElement =
				this._element.children[0].id === 'dialog-content'
					? this._element.children[0]
					: this._element.children[0].children[0].id === 'dialog-content'
					? this._element.children[0].children[0]
					: this._element.children[0].children[0].children[0].id === 'dialog-content'
					? this._element.children[0].children[0].children[0]
					: undefined

			const target = event.target as HTMLElement
			if (dialogContentElement?.contains(target)) return
			this.closeDialog()
		})
	}

	closeDialog() {
		this._dispose?.()
		this._uiStore.dispatch.closeDialog()
	}
}
