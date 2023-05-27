import { Directive, effect, ElementRef, inject, Input, Renderer2, signal } from '@angular/core'

@Directive({ selector: '[appCssToggle]', standalone: true })
export class CssToggleDirective {
	private _element = inject(ElementRef).nativeElement
	private _renderer = inject(Renderer2)
	private _toggle = signal(false)
	// private _trueClass!: string
	private _trueClasses!: string[]
	private _falseClasses!: string[]

	// private _falseClass!: string

	constructor() {
		effect(() => {
			const classesToRemove = this._toggle() ? this._falseClasses : this._trueClasses
			const classesToAdd = this._toggle() ? this._trueClasses : this._falseClasses
			classesToRemove.forEach((c) => this._renderer.removeClass(this._element, c))
			classesToAdd.forEach((c) => this._renderer.addClass(this._element, c))
			// this._renderer.removeClass(this._element, this._toggle() ? this._falseClass : this._trueClass)
			// this._renderer.addClass(this._element, this._toggle() ? this._trueClass : this._falseClass)
		})
	}

	@Input() set cssTogglePredicate(value: boolean) {
		this._toggle.set(value)
	}

	@Input() set cssToggleTrueClass(value: string) {
		// this._trueClass = value
		this._trueClasses = value.split(' ')
	}

	@Input() set cssToggleFalseClass(value: string) {
		// this._falseClass = value
		this._falseClasses = value.split(' ')
	}
}
