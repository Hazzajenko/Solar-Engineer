import { AsyncPipe, NgClass } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, computed, inject, Input } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { map, of } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
	selector: 'app-toggle-svg-class-no-styles',
	template: `
		<span [ngClass]="currentClass() ? currentClass() : ''" [innerHTML]="svgIcon()"></span>
	`,
	standalone: true,
	imports: [AsyncPipe, NgClass],
})
export class ToggleSvgClassNoStylesComponent {
	private http = inject(HttpClient)
	private sanitizer = inject(DomSanitizer)
	private _trueSvgPath!: string
	private _falseSvgPath!: string
	private _booleanValue!: boolean
	private _trueClass!: string
	private _falseClass!: string
	currentSvgPath = computed(() => (this._booleanValue ? this._trueSvgPath : this._falseSvgPath))
	// svgIcon$: Observable<SafeHtml> = this.initIcon(this._trueSvgPath)
	svgIcon = toSignal(this.initIcon(this.currentSvgPath()))
	@Input() inputClass?: string
	/*	this.svgIcon$ = this.http
	 .get(`assets/${path}.svg`, {
	 responseType: 'text',
	 })
	 .pipe(map((value) => this.sanitizer.bypassSecurityTrustHtml(value)))*/

	// svgIcon = computed(() => this.svgIcon$)
	currentClass = computed(() =>
		(
			(this._booleanValue ? this._trueClass : this._falseClass) +
			' ' +
			(this.inputClass ? this.inputClass : '')
		).trim(),
	)

	set booleanValue(value: boolean) {
		this._booleanValue = value
		// this.svgIcon$ = this.initIcon(value ? this._trueSvgPath : this._falseSvgPath)
	}

	@Input({ required: true }) set trueSvgPath(value: string) {
		this._trueSvgPath = value
	}

	@Input({ required: true }) set trueClass(value: string) {
		this._trueClass = value
	}

	@Input({ required: true }) set falseSvgPath(value: string) {
		this._falseSvgPath = value
	}

	@Input({ required: true }) set falseClass(value: string) {
		this._falseClass = value
	}

	@Input({ required: true }) set predicate(predicate: boolean | unknown) {
		if (typeof predicate === 'boolean') {
			this.booleanValue = predicate
			return
		}
		this.booleanValue = !!predicate
	}

	initIcon(path: string) {
		if (!path) return of(undefined)
		return this.http
			.get(`assets/${path}.svg`, {
				responseType: 'text',
			})
			.pipe(map((value) => this.sanitizer.bypassSecurityTrustHtml(value)))
	}

	/*	initIconSignal(path: string) {
	 return (this.svgIcon$ = this.http
	 .get(`assets/${path}.svg`, {
	 responseType: 'text',
	 })
	 .pipe(map((value) => this.sanitizer.bypassSecurityTrustHtml(value))))
	 }*/
}
