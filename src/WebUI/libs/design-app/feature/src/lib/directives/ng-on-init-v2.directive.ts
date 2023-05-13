import { AfterViewInit, Directive, EventEmitter, Output } from '@angular/core'

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ngOnInit]',
	standalone: true,
})
export class NgOnInitV2Directive implements AfterViewInit {
	@Output('ngOnInit') ngInit: EventEmitter<unknown> = new EventEmitter()

	ngAfterViewInit(): void {
		// this.ngInit.emit()
		setTimeout(() => this.ngInit.emit(), 100)
	}
}
