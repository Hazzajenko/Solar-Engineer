import { Directive, ElementRef, inject, Input, NgZone } from '@angular/core'
import tippy from 'tippy.js'

@Directive({
	selector: '[appZippyTooltip]',
	standalone: true,
})
export class ZippyTooltipDirective {
	private _element = inject(ElementRef).nativeElement
	private _ngZone = inject(NgZone)

	@Input() set toolTipHtml(toolTipHtml: string) {
		if (!toolTipHtml) return
		this._ngZone.runOutsideAngular(() => {
			tippy(this._element, {
				content: toolTipHtml,
				placement: 'top',
				allowHTML: true,
				theme: 'material',
				arrow: true,
			})
		})
	}

	@Input() set toolTipString(toolTipString: string) {
		if (!toolTipString) return
		this._ngZone.runOutsideAngular(() => {
			tippy(this._element, {
				content: this.toHtmlLight(toolTipString),
				placement: 'top-end',
				allowHTML: true, // theme: 'material',
				arrow: true,
			})
		})
	}

	private toHtml(tooltip: string) {
		return `<div class='absolute z-50 min-w-fit p-1 bg-white rounded shadow-xl text-xs text-gray-500'>${tooltip}</div>`
	}

	private toHtmlLight(tooltip: string) {
		return `<div class='absolute z-50 inline-block px-3 py-2 text-xs font-medium text-gray-900 bg-white rounded-lg shadow-sm tooltip'>
    ${tooltip}
</div>`
	}

	private toHtmlDark(tooltip: string) {
		return `<div class='absolute z-50 inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip'>
    ${tooltip}
</div>`
	}

	private toHtmlTheme(tooltip: string) {
		return `<div class='absolute z-50 inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white rounded-lg shadow-sm tooltip dark:bg-gray-700 dark:text-gray-100'>
    ${tooltip}
</div>`
	}
}
