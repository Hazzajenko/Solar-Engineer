import { AsyncPipe, NgClass } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, inject, Input } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { map, Observable } from 'rxjs'

@Component({
	selector: 'app-show-svg-no-styles',
	template: `
		<span [ngClass]="inputClass ? inputClass : ''" [innerHTML]="svgIcon$ | async"></span>
	`,
	standalone: true,
	imports: [AsyncPipe, NgClass],
})
export class ShowSvgNoStylesComponent {
	private http = inject(HttpClient)
	private sanitizer = inject(DomSanitizer)
	private _svgPath!: string
	svgIcon$: Observable<SafeHtml> = this.initIcon(this._svgPath)

	@Input({ required: true }) set svgPath(value: string) {
		this._svgPath = value
		this.svgIcon$ = this.initIcon(value)
	}

	@Input() inputClass?: string

	initIcon(path: string) {
		return (this.svgIcon$ = this.http
			.get(`assets/${path}.svg`, {
				responseType: 'text',
			})
			.pipe(map((value) => this.sanitizer.bypassSecurityTrustHtml(value))))
	}
}