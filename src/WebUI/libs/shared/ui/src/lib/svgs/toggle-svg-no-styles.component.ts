import { AsyncPipe, NgClass } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, inject, Input } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { map, Observable } from 'rxjs'

@Component({
	selector: 'app-toggle-svg-no-styles',
	template: `
		<span [ngClass]="inputClass ? inputClass : ''" [innerHTML]="svgIcon$ | async"></span>
	`,
	standalone: true,
	imports: [AsyncPipe, NgClass],
})
export class ToggleSvgNoStylesComponent {
	private http = inject(HttpClient)
	private sanitizer = inject(DomSanitizer)
	private _trueSvgPath!: string
	private _falseSvgPath!: string
	svgIcon$: Observable<SafeHtml> = this.initIcon(this._trueSvgPath)

	set booleanValue(value: boolean) {
		this.svgIcon$ = this.initIcon(value ? this._trueSvgPath : this._falseSvgPath)
	}

	@Input({ required: true }) set trueSvgPath(value: string) {
		this._trueSvgPath = value
	}

	@Input({ required: true }) set falseSvgPath(value: string) {
		this._falseSvgPath = value
	}

	@Input({ required: true }) set predicate(predicate: boolean | unknown) {
		if (typeof predicate === 'boolean') {
			this.booleanValue = predicate
			return
		}
		this.booleanValue = !!predicate
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
