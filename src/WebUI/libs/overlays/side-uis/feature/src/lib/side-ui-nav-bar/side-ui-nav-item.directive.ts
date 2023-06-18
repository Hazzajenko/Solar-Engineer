import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core'

@Directive({ selector: '[sideUiNavItem]', standalone: true })
export class SideUiNavItemDirective {
	private _element = inject(ElementRef<HTMLElement>).nativeElement
	private _renderer = inject(Renderer2)

	isSelectedClasses =
		'bg-gray-200 text-gray-900 hover:text-gray-700 dark:hover:text-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md'
	isNotSelectedClasses =
		'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 rounded-md'

	@Input({ required: true }) set isSelected(value: boolean) {
		if (value) {
			for (const className of this.isNotSelectedClasses.split(' ')) {
				this._renderer.removeClass(this._element, className)
			}
			for (const className of this.isSelectedClasses.split(' ')) {
				this._renderer.addClass(this._element, className)
			}
		} else {
			for (const className of this.isSelectedClasses.split(' ')) {
				this._renderer.removeClass(this._element, className)
			}
			for (const className of this.isNotSelectedClasses.split(' ')) {
				this._renderer.addClass(this._element, className)
			}
		}
	}
}
