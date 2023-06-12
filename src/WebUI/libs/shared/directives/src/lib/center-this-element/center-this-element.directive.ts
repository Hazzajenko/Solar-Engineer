import { Directive, ElementRef, inject, Input, OnInit, Renderer2 } from '@angular/core'

// justify-end justify-between justify-start justify-center justify-evenly
// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[centerThisElement]', standalone: true })
export class CenterThisElementDirective implements OnInit {
	private _element = inject(ElementRef<Element>).nativeElement
	private _renderer = inject(Renderer2)
	private _newParent?: HTMLDivElement

	@Input() set justifyContent(
		value: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly',
	) {
		if (!this._newParent) {
			setTimeout(() => {
				this.justifyContent = value
			}, 1)
			return
		}
		this._renderer.setStyle(this._newParent, 'justify-content', value)
	}

	ngOnInit() {
		const div = this._renderer.createElement('div') as HTMLDivElement
		const parent = this._element.parentElement as Element
		this._renderer.insertBefore(parent, div, this._element)
		this._renderer.appendChild(div, this._element)

		this._renderer.setStyle(div, 'display', 'flex')
		this._renderer.setStyle(div, 'align-items', 'center')
		this._renderer.setStyle(div, 'justify-content', 'center')
		this._newParent = div
	}
}

// dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700
