import { Directive, ElementRef, inject, OnInit } from '@angular/core'

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[enableDefaultHoverEffects]', standalone: true })
export class DefaultHoverEffectsDirective implements OnInit {
	private _element = inject(ElementRef).nativeElement

	ngOnInit() {
		this._element.classList.add('text-gray-400', 'hover:text-gray-900', 'dark:hover:text-white')
	}
}
