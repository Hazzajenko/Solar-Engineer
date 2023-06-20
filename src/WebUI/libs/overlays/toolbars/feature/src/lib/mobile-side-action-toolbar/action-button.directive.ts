import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core'

@Directive({ selector: '[appActionButton]', standalone: true })
export class ActionButtonDirective {
	private _element = inject(ElementRef<HTMLButtonElement>).nativeElement
	private _renderer = inject(Renderer2)

	classes = ['scale-125', 'text-gray-700']

	@Input({ required: true }) set isActive(value: boolean) {
		if (value) {
			for (const className of this.classes) {
				this._renderer.addClass(this._element, className)
			}
			// this._renderer.addClass(this._element, ...this.classes)
			// this._element.classList.add(...this.classes)
			// this._element.classList.add('active')
			this._element.disabled = false
		} else {
			for (const className of this.classes) {
				this._renderer.removeClass(this._element, className)
			}
			// this._element.classList.remove(...this.classes)
			this._element.disabled = true
			// this._element.classList.remove('active')
		}
	}
}
