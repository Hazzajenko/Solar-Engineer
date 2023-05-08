import { Directive, ElementRef, inject, Input, NgZone } from '@angular/core'
import tippy from 'tippy.js'
// import 'tippy.js/animations/scale.css'

// import 'tippy.js/themes/tomato.css'

@Directive({
	selector: '[appZippyTooltip]',
	standalone: true,
})
export class ZippyTooltipDirective {
	private _element = inject(ElementRef).nativeElement
	private _ngZone = inject(NgZone)

	@Input({ required: true }) set tooltip(tooltip: string) {
		if (!tooltip) return
		/*		const content = `
		 <div class='absolute z-50 w-64 p-4 bg-white rounded shadow-xl'>
		 <div class='flex flex-col'>
		 <div class='flex flex-row justify-between'>
		 <div class='flex flex-col'>
		 <div class='text-sm font-semibold text-gray-800'>${tooltip}</div>
		 <div class='text-xs text-gray-500'>${tooltip}</div>

		 </div>
		 </div>
		 </div>
		 </div>
		 `*/
		// const content = createTooltipHtmlV2(tooltip)
		// const content = createTooltipTemplate(tooltip)
		this._ngZone.runOutsideAngular(() => {
			tippy(this._element, {
				content: tooltip, // content: tooltip, // animation: 'scale',
				// content, // content: tooltip, // animation: 'scale',
				placement: 'top',
				animateFill: true,
				allowHTML: true,
				theme: 'material', // theme: 'light-border',
				followCursor: true /*			aria: {
				 content: 'describedby',
				 },*/,
				arrow: true, // render,
			})
			this._element.style.cursor = 'help'
		})
	}
}
