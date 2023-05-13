import { Directive, EventEmitter, OnInit, Output } from '@angular/core'

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ngInitDirective]',
	standalone: true,
})
export class NgInitDirective implements OnInit {
	@Output() ngInit: EventEmitter<any> = new EventEmitter()

	ngOnInit() {
		this.ngInit.emit()
		/*		if (this.isLast) {
		 setTimeout(() => this.initEvent.emit(), 10);
		 }*/
	}
}
