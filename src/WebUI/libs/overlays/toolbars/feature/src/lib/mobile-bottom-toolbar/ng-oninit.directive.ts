import { Directive, EventEmitter, OnInit, Output } from '@angular/core'

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[divInit]', standalone: true })
export class NgOnInitDirective implements OnInit {
	// constructor() { }
	@Output() divInit = new EventEmitter<void>()

	ngOnInit(): void {
		this.divInit.emit()
	}
}
