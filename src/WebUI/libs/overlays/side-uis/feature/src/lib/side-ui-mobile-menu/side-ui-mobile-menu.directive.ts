import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core'

@Directive({ selector: '[sideUiMobileMenu]', standalone: true })
export class SideUiMobileMenuDirective {
	private _element = inject(ElementRef<HTMLElement>).nativeElement
	private _renderer = inject(Renderer2)

	@Input({ required: true }) set sideUiMobileMenu(value: boolean) {
		if (value) {
			this._renderer.addClass(this._element, 'translate-x-0')
		} else {
			this._renderer.removeClass(this._element, 'translate-x-0')
		}
	}
}
