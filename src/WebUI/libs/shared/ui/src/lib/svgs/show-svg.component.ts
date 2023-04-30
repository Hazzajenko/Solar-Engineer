import { AsyncPipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, inject, Input } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { map, Observable } from 'rxjs'


@Component({
	selector: 'app-show-svg[svgPath]',
	template: `
		<span
			class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
			[innerHTML]="svgIcon$ | async"
		></span>
	`,
	standalone: true,
	imports: [AsyncPipe],
})
export class ShowSvgComponent {
	private http = inject(HttpClient)
	private sanitizer = inject(DomSanitizer)
	private _svgPath!: string
	svgIcon$: Observable<SafeHtml> = this.initIcon(this._svgPath)

	@Input() set svgPath(value: string) {
		this._svgPath = value
		this.svgIcon$ = this.initIcon(value)
	}

	initIcon(path: string) {
		return (this.svgIcon$ = this.http
			.get(`assets/${path}.svg`, {
				responseType: 'text',
			})
			.pipe(map((value) => this.sanitizer.bypassSecurityTrustHtml(value))))
	}
}