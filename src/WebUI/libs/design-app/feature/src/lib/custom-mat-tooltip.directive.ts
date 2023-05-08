import { Directive, ElementRef, inject, Input, NgZone } from '@angular/core'
import tippy from 'tippy.js'

@Directive({
	selector: '[appZippyTooltip]',
	standalone: true,
})
export class CustomMatTooltipDirective {
	private _element = inject(ElementRef).nativeElement
	private _ngZone = inject(NgZone)

	@Input({ required: true }) set tooltip(tooltip: string) {
		if (!tooltip) return
		this._ngZone.runOutsideAngular(() => {
			tippy(this._element, {
				content: tooltip,
				animation: 'scale',
				placement: 'top',
				allowHTML: true,
				theme: 'light-border',
				followCursor: true,
				aria: {
					content: 'describedby',
				},
				arrow: true,
			})
			this._element.style.cursor = 'help'
		})
	}
}
