import { AsyncPipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, inject, Input } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { map, Observable } from 'rxjs'

@Component({
	selector: 'app-show-svg-v2[svgPath]',
	template: `
		<span
			[style.height]="height + 'rem'"
			[style.width]="width + 'rem'"
			class="mr-3 text-gray-400 group-hover:text-gray-500"
			[innerHTML]="svgIcon$ | async"
		></span>
	`,
	standalone: true,
	imports: [AsyncPipe],
})
export class ShowSvgV2Component {
	private http = inject(HttpClient)
	private sanitizer = inject(DomSanitizer)
	private _svgPath!: string
	svgIcon$: Observable<SafeHtml> = this.initIcon(this._svgPath)
	@Input() height = 5
	@Input() width = 5

	@Input() set svgPath(value: string) {
		this._svgPath = value
		this.svgIcon$ = this.initIcon(value)
	}

	initIcon(path: string) {
		return (this.svgIcon$ = this.http
			.get(`assets/svgs/${path}.svg`, {
				responseType: 'text',
			})
			.pipe(map((value) => this.sanitizer.bypassSecurityTrustHtml(value))))
	}
}
