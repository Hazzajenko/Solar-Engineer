import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core'

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[centerThisElement]', standalone: true })
export class CenterThisElementDirective implements OnInit {
	private _element = inject(ElementRef<Element>).nativeElement
	private _renderer = inject(Renderer2)

	ngOnInit() {
		const div = this._renderer.createElement('div') as HTMLDivElement
		const parent = this._element.parentElement as Element
		this._renderer.insertBefore(parent, div, this._element)
		this._renderer.appendChild(div, this._element)

		this._renderer.setStyle(div, 'display', 'flex')
		this._renderer.setStyle(div, 'align-items', 'center')
		this._renderer.setStyle(div, 'justify-content', 'center')
	}
}
