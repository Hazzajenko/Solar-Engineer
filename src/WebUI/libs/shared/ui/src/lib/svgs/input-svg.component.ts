import { AsyncPipe, NgClass } from '@angular/common'
import { Component, ElementRef, inject, Input, Renderer2 } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { AppSvgKey, getSvgByKey } from '@shared/assets'

@Component({
	selector: 'svg-input',
	template: ` <span [ngClass]="svgClass ? svgClass : ''" [innerHTML]="svg"></span> `,
	standalone: true,
	imports: [AsyncPipe, NgClass],
})
export class InputSvgComponent {
	private _elementRef = inject(ElementRef)
	private _renderer = inject(Renderer2)
	private sanitizer = inject(DomSanitizer)
	svg?: SafeHtml
	svgClass?: string

	@Input({ required: true }) set svgName(value: AppSvgKey) {
		const svg = getSvgByKey(value)
		this.svg = this.sanitizer.bypassSecurityTrustHtml(svg)
	}

	@Input() set center(value: boolean | undefined) {
		if (value) {
			this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'flex')
			this._renderer.setStyle(this._elementRef.nativeElement, 'align-items', 'center')
			this._renderer.setStyle(this._elementRef.nativeElement, 'justify-content', 'center')
		}
	}

	@Input() set inputClass(value: string | undefined) {
		this.svgClass = value
	}

	/*	@Input({ required: true }) set svgData(value: string) {
	 this.svg = this.sanitizer.bypassSecurityTrustHtml(value)
	 }*/
}
