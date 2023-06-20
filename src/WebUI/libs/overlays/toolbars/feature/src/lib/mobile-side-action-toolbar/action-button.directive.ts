import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core'

@Directive({ selector: '[appActionButton]', standalone: true })
export class ActionButtonDirective {
	private _element = inject(ElementRef<HTMLElement>).nativeElement
	private _renderer = inject(Renderer2)

	@Input({ required: true }) set isActive(value: boolean) {
		if (value) {
			this._element.classList.add('active')
		} else {
			this._element.classList.remove('active')
		}
	}
}
