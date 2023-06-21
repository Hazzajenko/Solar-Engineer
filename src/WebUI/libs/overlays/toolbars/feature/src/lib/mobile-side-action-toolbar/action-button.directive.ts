import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core'

@Directive({ selector: '[appActionButton]', standalone: true })
export class ActionButtonDirective {
	private _element = inject(ElementRef<HTMLButtonElement>).nativeElement
	private _renderer = inject(Renderer2)
	scaleClass = `scale-125`
	textGray700Class = 'text-gray-700'

	@Input() set scale(value: number) {
		this.scaleClass = `scale-${value}`
	}

	@Input({ required: true }) set isActive(value: boolean) {
		if (value) {
			this._renderer.addClass(this._element, this.textGray700Class)
			this._renderer.addClass(this._element, this.scaleClass)
			this._element.disabled = false
		} else {
			this._renderer.removeClass(this._element, this.textGray700Class)
			this._renderer.removeClass(this._element, this.scaleClass)
			this._element.disabled = true
		}
	}
}
