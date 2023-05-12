import { Directive, EventEmitter, OnInit, Output } from '@angular/core'

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ngInit]',
	standalone: true,
})
export class NgInitDirective implements OnInit {
	@Output('ngInit') initEvent: EventEmitter<any> = new EventEmitter()

	ngOnInit() {
		this.initEvent.emit()
		/*		if (this.isLast) {
		 setTimeout(() => this.initEvent.emit(), 10);
		 }*/
	}
}
